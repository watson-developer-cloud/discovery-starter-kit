
def get_constants(discovery, regular_name, enriched_name):
    environments_response = discovery.get_environments()
    environment_id = find_byod_environment_id(environments_response)
    collections_response = discovery.list_collections(
                            environment_id=environment_id
                            )
    regular_collection_id = find_collection_id(
                              collections_response,
                              regular_name
                            )
    enriched_collection_id = find_collection_id(
                              collections_response,
                              enriched_name
                            )
    return {
      'environment_id': environment_id,
      'collection_id_regular': regular_collection_id,
      'collection_id_enriched': enriched_collection_id
    }


def find_byod_environment_id(environments_response):
    my_env = [environment['environment_id']
              for environment
              in environments_response['environments']
              if not(environment['read_only'])]

    return '' if len(my_env) == 0 else my_env[0]


def find_collection_id(collections_response, collection_name):
    my_coll = [collection['collection_id']
               for collection
               in collections_response['collections']
               if collection['name'] == collection_name]

    return '' if len(my_coll) == 0 else my_coll[0]


def get_questions(discovery, constants):
    # return the top 4000 questions from the dataset
    query_options = {
     'aggregation': 'term(question.title,count:4000)',
     'count': 0
    }

    response = discovery.query(
                  environment_id=constants['environment_id'],
                  collection_id=constants['collection_id_regular'],
                  query_options=query_options
                )

    questions = map(lambda result: result['key'],
                    response['aggregations'][0]['results'])

    return questions
