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


@app.route("/sync")
def sync():
    return srsly_client.sync()


@app.route("/cards")
def fetch_all():
    cards = srsly_client.fetch_all()
    return {"cards": [card.to_json() for card in cards]}

@app.route("/card/<id>/reset")
def reset(id):
    card = srsly_client.reset_card(id)
    return {"card": card.to_json()}

@app.route("/card/<id>/delete")
def reset(id):
    res = srsly_client.delete_card(id)
    return {"deleted": res}


@app.route("/review", method="GET")
def fetch_review():
    cards = srsly_client.fetch_review()
    return {"cards": [card.to_json() for card in cards]}


@app.route("/review", method="POST")
def review():
    data = bottle.request.json
    updated_card = srsly_client.review(data)
    return updated_card.to_json()



def main():
    bottle.run(app, host="localhost", port=8080, debug=True)


if __name__ == "__main__":
    main()
