import os
import bottle
import requests
from srsly.hypothesis import HypothesisClient
from srsly.srsly import SrslyClient

from dotenv import load_dotenv
load_dotenv()

app = bottle.Bottle()

h_client = HypothesisClient(
    os.getenv("HYPOTHESIS_USER"),
    os.getenv("HYPOTHESIS_TOKEN"))
srsly_client = SrslyClient(h_client)


@app.route("/api/sync")
def sync():
    return srsly_client.sync()


@app.route("/api/cards")
def fetch_all():
    cards = srsly_client.fetch_all()
    return {"cards": [card.to_json() for card in cards]}

@app.route("/api/card/<id>/reset")
def reset(id):
    card = srsly_client.reset_card(id)
    return {"card": card.to_json()}

@app.route("/api/card/<id>/delete")
def reset(id):
    res = srsly_client.delete_card(id)
    return {"deleted": res}

@app.route("/api/review", method="GET")
def fetch_review():
    cards = srsly_client.fetch_review()
    return {"cards": [card.to_json() for card in cards]}

@app.route("/api/card/<id>/review", method="POST")
def review(id):
    data = bottle.request.json
    updated_card = srsly_client.review(id, data["rating"])
    return updated_card.to_json()

@app.route('/')
@app.route('/<url>')
def home(url=None):
    return bottle.static_file("index.html", root='frontend/build')

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return bottle.static_file(filepath, root='frontend/build/static')

def main():
    bottle.run(app, host="0.0.0.0", port=8080, debug=True)


if __name__ == "__main__":
    main()
