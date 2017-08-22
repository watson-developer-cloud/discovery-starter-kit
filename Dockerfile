FROM python:2-alpine

RUN apt-get update && apt-get install -y npm && apt-get clean
RUN npm install --prefix client/knowledge_base_search
RUN npm run build --prefix client/knowledge_base_search
RUN pip install -r server/python/requirements/production.txt

CMD ["python", "server/python/server.py"]
