import xml.etree.ElementTree
import json
import sys
import os
import hashlib
from collections import defaultdict
from bs4 import BeautifulSoup

if '__file__' in globals():
    sys.path.insert(0, os.path.join(os.path.abspath(__file__), 'scripts'))
else:
    sys.path.insert(0, os.path.join(os.path.abspath(os.getcwd()), 'scripts'))

from discovery_setup_utils import curdir, makeSurePathExists # noqa

# 'DATA_TYPE' should be the same as the data set downloaded
DATA_TYPE = 'travel'

# INPUT_DIR should correspond to the location of the extracted stackexchange
# by default, evaluates to <current_project_dir>/data/<DATA_TYPE>
INPUT_DIR = os.path.abspath(
                os.path.join(os.path.abspath(curdir), '..', 'data', DATA_TYPE)
            )

# OUTPUT_DIR should correspond where you want your documents written to disk
# by default, evaluates to <INPUT_DIR>/json
OUTPUT_DIR = os.path.abspath(os.path.join(INPUT_DIR, 'json'))
makeSurePathExists(OUTPUT_DIR)


def stripSpecial(html_doc):
    soup = BeautifulSoup(html_doc, 'html.parser')
    return soup.get_text()


def genId(filename):
    """
    Generates an identifier suitable for ingestion
    Based off of the Watson Discovery Tooling method of generating IDs
    """
    return hashlib.md5(filename).hexdigest()


def genFilename(id):
    return "%s_%s.json" % (DATA_TYPE, str(id))


def genTrainingFilename(id):
    return "train_%s.json" % str(id)


def getUsers(usersXML, OUTPUT_DIR):
    """
    Returns a dictionary of user ID to dictionary of user properties:
    {
      "<userid_int>": {
        "reputation": <reputation_int>,
        "displayName": <displayname_str>
      }
    }
    """
    print('Starting getUsers...')
    USERS_FILE_NAME = 'users.json'
    USERS_FILE_PATH = os.path.abspath(
                        os.path.join(OUTPUT_DIR, '..', USERS_FILE_NAME)
                      )

    if os.path.isfile(USERS_FILE_PATH):
        print('Loading users from file cache...')
        with open(USERS_FILE_PATH, 'r') as usersFile:
            return json.loads(usersFile.read())

    users_to_metadata = {}
    for user in usersXML.findall('row'):
        reputation = int(user.get('Reputation'))
        name = user.get('DisplayName')
        users_to_metadata[user.get('Id')] = {'reputation': reputation,
                                             'displayName': name}

    # write the file for later runs
    user_to_metadata_str = json.dumps(users_to_metadata).replace('\n', '')
    with open(USERS_FILE_PATH, 'w') as usersFile:
        usersFile.write(user_to_metadata_str + '\n')
    return users_to_metadata


def getVotes(votesXML, OUTPUT_DIR):
    """
    Returns a dictionary of posts to vote types with counts of each type:
    {
      "<post_id_str>": {
        "<vote_type_id_str>": <vote_count_int>,
        "<vote_type_id_str>": <vote_count_int>,
        ...
      }
    }
    """

    print('Starting getVotes...')
    VOTES_FILE_NAME = 'votes.json'
    VOTES_FILE_PATH = os.path.abspath(
                        os.path.join(OUTPUT_DIR, '..', VOTES_FILE_NAME)
                      )

    if os.path.isfile(VOTES_FILE_PATH):
        print('Loading votes from file cache...')
        with open(VOTES_FILE_PATH, 'r') as votesFile:
            return json.loads(votesFile.read())

    # Types of votes
    # Id | Name
    # -- | ----------------------
    # 1  | AcceptedByOriginator
    # 2  | UpMod
    # 3  | DownMod
    # 4  | Offensive
    # 5  | Favorite
    # 6  | Close
    # 7  | Reopen
    # 8  | BountyStart
    # 9  | BountyClose
    # 10 | Deletion
    # 11 | Undeletion
    # 12 | Spam
    # 15 | ModeratorReview
    # 16 | ApproveEditSuggestion
    initial_vote_types = {'1': 0,
                          '2': 0,
                          '3': 0,
                          '4': 0,
                          '5': 0,
                          '6': 0,
                          '7': 0,
                          '8': 0,
                          '9': 0,
                          '10': 0,
                          '11': 0,
                          '12': 0,
                          '15': 0,
                          '16': 0}
    posts_to_votes = defaultdict(dict)
    for vote in votesXML.findall('row'):
        voteTypeId = vote.get('VoteTypeId')
        if voteTypeId in initial_vote_types:
            postId = vote.get('PostId')
            if postId in posts_to_votes:
                newCount = posts_to_votes[postId][voteTypeId] + 1
                posts_to_votes[postId][voteTypeId] = newCount
            else:
                posts_to_votes[postId] = initial_vote_types.copy()
                posts_to_votes[postId][voteTypeId] = 1

    # write the file for later runs
    posts_to_votes_str = json.dumps(posts_to_votes).replace('\n', '')
    with open(VOTES_FILE_PATH, 'w') as votesFile:
        votesFile.write(posts_to_votes_str + '\n')

    return posts_to_votes


def extractQuestion(document):
    return {'title': document.get('title'),
            'subtitle': document.get('subtitle')}


def extractQuestionMetadata(document):
    return {'id': document.get('id'),
            'score': document.get('score'),
            'views': document.get('views'),
            'tags': document.get('tags')}


def extractAuthorMetadata(document):
    authorUserId = document.get('authorUserId')
    return {'id': authorUserId,
            'username': usersDict.get(authorUserId, {}).get('displayName', 0)}


def handleQuestion(documents, question, OUTPUT_DIR):
    postId = question.get('Id')
    title = stripSpecial(question.get('Title'))
    subtitle = stripSpecial(question.get('Body'))
    answerCount = int(question.get('AnswerCount'))
    views = int(question.get('ViewCount'))
    tags = str(question.get('Tags'))
    score = int(question.get('Score'))
    acceptedAnswerId = question.get('AcceptedAnswerId', 0)
    authorUserId = question.get('OwnerUserId')

    if postId in documents:
        # need to write out the answers in this question that got skipped
        current_document = documents.get(postId)
        current_document['title'] = title
        current_document['subtitle'] = subtitle
        current_document['authorUserId'] = authorUserId
        current_document['acceptedAnswerId'] = acceptedAnswerId
        current_document['views'] = views
        current_document['tags'] = tags
        current_document['score'] = score
        current_document['answerCount'] = answerCount
        documents[postId] = current_document

        for skipped_answer in current_document.get('skipped_answers'):
            answer_metadata = skipped_answer.get('answer_metadata')
            answer_id = answer_metadata.get('id')
            if answer_id == acceptedAnswerId:
                answer_metadata['accepted'] = 1
            file_name = genFilename(answer_id)
            generatedId = genId(file_name)
            item = {'id': generatedId,
                    'text': skipped_answer.get('text'),
                    'question': extractQuestion(current_document),
                    'question_metadata': extractQuestionMetadata(
                                          current_document
                                         ),
                    'answer_metadata': answer_metadata,
                    'author_metadata': extractAuthorMetadata(current_document),
                    'user_metadata': skipped_answer.get('user_metadata')}
            print('writing a skipped answer ID: ' + answer_id)
            writeAnswerFile(file_name, item, OUTPUT_DIR)

    else:
        documents[postId] = {'id': postId, 'title': title,
                             'subtitle': subtitle, 'answerCount': answerCount,
                             'authorUserId': authorUserId,
                             'acceptedAnswerId': acceptedAnswerId,
                             'views': views, 'tags': tags, 'score': score}


def handleAnswer(documents, answer, votesDict, usersDict, OUTPUT_DIR):
    postId = answer.get('Id')
    parentId = answer.get('ParentId')

    # answer information
    userId = answer.get('OwnerUserId')
    name = usersDict.get(userId, {}).get('displayName', '')
    reputation = usersDict.get(userId, {}).get('reputation', 0)
    user_metadata = {'id': userId, 'username': name, 'reputation': reputation}
    answerText = stripSpecial(answer.get('Body'))

    vote_types_to_count = votesDict.get(postId, {})

    upVotes = 0
    downVotes = 0
    UP_VOTE = '2'
    DOWN_VOTE = '3'
    if UP_VOTE in vote_types_to_count:
        upVotes = int(vote_types_to_count[UP_VOTE])
    if DOWN_VOTE in vote_types_to_count:
        downVotes = int(vote_types_to_count[DOWN_VOTE])

    answer_metadata = {'id': postId,
                       'score': int(answer.get('Score')),
                       'upModVotes': upVotes,
                       'downModVotes': downVotes,
                       'accepted': 0,
                       'length': len(answerText)}

    current_document = documents.get(parentId)
    if current_document and current_document.get('title'):
        # write out the answer to file
        if postId == current_document.get('acceptedAnswerId'):
            answer_metadata['accepted'] = 1
        file_name = genFilename(postId)
        generatedId = genId(file_name)
        item = {'id': generatedId,
                'text': answerText,
                'question': extractQuestion(current_document),
                'question_metadata': extractQuestionMetadata(current_document),
                'answer_metadata': answer_metadata,
                'author_metadata': extractAuthorMetadata(current_document),
                'user_metadata': user_metadata}

        writeAnswerFile(file_name, item, OUTPUT_DIR)
    else:
        # save it until later when we have the question text
        skipped_answers = []
        if documents.get(parentId):
            # answers already exist
            skipped_answers = documents.get(parentId).get('skipped_answers')
        else:
            documents[parentId] = {}

        skipped_answer = {'text': answerText,
                          'answer_metadata': answer_metadata,
                          'user_metadata': user_metadata}
        skipped_answers.append(skipped_answer)
        documents[parentId]['skipped_answers'] = skipped_answers


def validAnswer(item):
    """
    determine whether or not the item has the required keys to write to file
    """
    keys = {'id', 'text', 'question', 'question_metadata', 'answer_metadata',
            'author_metadata', 'user_metadata'}
    return keys <= set(item)


def writeAnswerFile(file_name, item, OUTPUT_DIR):
    """
    writes the item as a document to be used for ingestion
    """
    if validAnswer(item):
        with open(os.path.join(OUTPUT_DIR, file_name), 'w') as answer_file:
            answer_file.write(json.dumps(item).replace('\n', '') + '\n')
    else:
        print('Item missing required keys!')
        print(json.dumps(item, indent=4))


def writeDocuments(postsXML, votesDict, usersDict, OUTPUT_DIR):
    """
    splits the posts XML file into individual answer units by pairing 1 answer
    to its corresponding question to prepare for document ingestion
    (thus the question will be duplicated for multiple answers)
    """
    documents = {}
    for post in postsXML.findall('row'):
        # Types of posts
        # Id | Name
        # -- | ---------
        # 1  | Question
        # 2  | Answer
        postTypeId = int(post.get('PostTypeId'))

        if postTypeId == 1:
            handleQuestion(documents, post, OUTPUT_DIR)

        elif postTypeId == 2:
            handleAnswer(documents, post, votesDict, usersDict, OUTPUT_DIR)


print('Getting Posts...')
postsXML = xml.etree.ElementTree.parse(
            os.path.join(INPUT_DIR, 'Posts.xml')
           ).getroot()
print('Posts loaded')
print('Getting Votes...')
votesXML = xml.etree.ElementTree.parse(
            os.path.join(INPUT_DIR, 'Votes.xml')
           ).getroot()
votesDict = getVotes(votesXML, OUTPUT_DIR)
print('Votes loaded')
print('Getting Users...')
usersXML = xml.etree.ElementTree.parse(
            os.path.join(INPUT_DIR, 'Users.xml')
           ).getroot()
usersDict = getUsers(usersXML, OUTPUT_DIR)
print('Users loaded')

print('Begin writing documents...')
writeDocuments(postsXML, votesDict, usersDict, OUTPUT_DIR)
print("Documents written to %s" % OUTPUT_DIR)
