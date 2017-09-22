

def get_constants(
      discovery,
      passages_name=None,
      regular_name=None,
      trained_name=None):
    """
    Returns a dict containing environment and collection ids with the format:
    {
      environment_id: env_id,
      collection_id: {
        passages: passages_id,
        regular: regular_id,
        trained: trained_id
      }
    }
    """
    environments_response = discovery.get_environments()
    environment_id = find_byod_environment_id(environments_response)
    constants = {'environment_id': environment_id}
    constants['collection_id'] = {}
    collections_response = discovery.list_collections(
                            environment_id=environment_id
                            )
    passages_collection_id = find_collection_id(
                              collections_response,
                              passages_name
                            )
    if not(passages_collection_id == ''):
        constants['collection_id']['passages'] = passages_collection_id

    regular_collection_id = find_collection_id(
                              collections_response,
                              regular_name
                            )
    if not(regular_collection_id == ''):
        constants['collection_id']['regular'] = regular_collection_id

    trained_collection_id = find_collection_id(
                              collections_response,
                              trained_name
                            )

    if not(trained_collection_id == ''):
        constants['collection_id']['trained'] = trained_collection_id

    return constants


def find_byod_environment_id(environments_response):
    my_env = [environment['environment_id']
              for environment
              in environments_response['environments']
              if not(environment['read_only'])]

    return '' if len(my_env) == 0 else my_env[0]


def find_collection_id(collections_response, collection_name):
    if collection_name is None:
        return ''

    my_coll = [collection['collection_id']
               for collection
               in collections_response['collections']
               if collection['name'] == collection_name]

    return '' if len(my_coll) == 0 else my_coll[0]


def get_questions(discovery, constants, question_count, feature_type):
    # return the top question_count questions from the dataset
    aggregation = 'term(question.title,count:%s)'
    query_options = {
     'aggregation': aggregation % str(question_count),
     'count': 0
    }

    response = discovery.query(
                  environment_id=constants['environment_id'],
                  collection_id=constants['collection_id'][feature_type],
                  query_options=query_options
                )

    questions = map(lambda result: {'question': result['key']},
                    response['aggregations'][0]['results'])

    """
    if we are getting questions for the trained collection,
    annotate ones part of the training data with 'is_training_query'
    """
    if feature_type == 'trained':
        training_data = discovery.list_training_data(
          environment_id=constants['environment_id'],
          collection_id=constants['collection_id'][feature_type])

        for training_query in training_data['queries']:
            try:
                query_index = questions.index(
                  {'question': training_query['natural_language_query']})
                questions[query_index]['is_training_query'] = True
            except ValueError:
                continue

    return questions
