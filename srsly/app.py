import json
import bottle
import requests
from srsly.hypothesis import HypothesisClient
from srsly.srsly import SrslyClient

app = bottle.Bottle()

with open("config.json", "r") as f:
    config = json.load(f)

h_client = HypothesisClient(config["user"], config["token"])
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

@app.route("/api/review", method="POST")
def review():
    data = bottle.request.json
    updated_card = srsly_client.review(data)
    return updated_card.to_json()

@app.route('/')
@app.route('/<url>')
def home(url=None):
    return bottle.static_file("index.html", root='frontend/build')

@app.route('/static/<filepath:path>')
def server_static(filepath):
    return bottle.static_file(filepath, root='frontend/build/static')

def main():
    bottle.run(app, host="localhost", port=8080, debug=True)


if __name__ == "__main__":
    main()
