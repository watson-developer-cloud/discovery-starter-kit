import xml.etree.ElementTree
import sys
import os
import hashlib
import json
from collections import OrderedDict

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

# percentage of documents used for training
SPLIT_PERCENTAGE = 0.8

# directory where training data will be saved
TRAINING_DIR = os.path.join(INPUT_DIR, 'training')
makeSurePathExists(TRAINING_DIR)

# total words allowed in a question
MAX_WORDS = 10

# Rating/Label used to indicate "relevant" answer
RELEVANT_RATING = 10

# Rating/Label used to indicate a "not relevant" answer
IRRELEVANT_RATING = 0

# total answers needed per question for ratings
ANSWERS_NEEDED = 2


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


print('Getting Posts...')
postsXML = xml.etree.ElementTree.parse(
            os.path.join(INPUT_DIR, 'Posts.xml')
           ).getroot()

qa_dict = {}

for post in postsXML.findall('row'):
    postId = post.get('Id')
    # Types of posts
    # Id | Name
    # -- | ---------
    # 1  | Question
    # 2  | Answer
    postTypeId = int(post.get('PostTypeId'))

    if postTypeId == 1:
        # add the question to the qa_dict if it doesn't exist
        question_to_answers = qa_dict.get(postId, {})
        question_to_answers['id'] = postId
        question_to_answers['question'] = post.get('Title')
        qa_dict[postId] = question_to_answers

    elif postTypeId == 2:
        # copy the answer into the correct question in the qa_dict
        parentId = post.get('ParentId')
        question_to_answers = qa_dict.get(parentId, {})
        answer_to_scores = question_to_answers.get('answers', {})
        answer_to_scores[postId] = int(post.get('Score'))
        question_to_answers['answers'] = answer_to_scores
        qa_dict[parentId] = question_to_answers


print('Begin training data')
# ordering the dictionary for relevance
for key, value in qa_dict.items():

    if 'answers' in value:
        sorted_stuff = sorted(value['answers'].items(),
                              key=lambda x: x[1],
                              reverse=True)
        qa_dict[key]['answers'] = OrderedDict(sorted_stuff)

total_docs = len(qa_dict)
train_docs_length = int(total_docs * SPLIT_PERCENTAGE)
print ('length of documents: %d ' % total_docs)
print ('train document length: %d ' % train_docs_length)

train_documents = list(qa_dict.values())[:train_docs_length]

print ('length of train documents: %d ' % len(train_documents))

questions_skipped = 0
questions_written = 0
for document in train_documents:
    postId = document.get('id')
    question = document.get('question')
    question_words = question.split()
    answers = document.get('answers', [])
    question_too_long = len(question_words) > MAX_WORDS
    not_enough_answers = len(answers) < ANSWERS_NEEDED
    if not_enough_answers or question_too_long:
        questions_skipped += 1
        print ("skipping question: '%s'" % question)
        print ("answers length: %d" % len(answers))
        print ("question words: %d" % len(question_words))
        continue

    training_dict = {'natural_language_query': question}

    # get the first answer
    answer_first_id = answers.popitem(last=False)[0]
    first_answer = {'document_id': genId(genFilename(answer_first_id)),
                    'relevance': RELEVANT_RATING}

    # get the last answer (for bad rating)
    answer_last_id = answers.popitem()[0]
    last_answer = {'document_id': genId(genFilename(answer_last_id)),
                   'relevance': IRRELEVANT_RATING}

    training_dict['examples'] = [first_answer, last_answer]
    train_filepath = os.path.join(TRAINING_DIR, genTrainingFilename(postId))
    with open(train_filepath, 'w') as train_file:
        train_file.write(json.dumps(training_dict).replace('\n', '') + '\n')
        questions_written += 1

print('Finished writing training data!')
print("skipped %d questions" % questions_skipped)
print("wrote %d questions" % questions_written)
