from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return u'heloo'

app.run(debug=True, port=80)