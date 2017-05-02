from flask import Flask
app = Flask(__name__)


@app.route('/')
def index():
    return 'Watson Discovery Service Starter Kit'


if __name__ == '__main__':
    app.run()
