import bottle
import requests
from srsly.hypothesis import HypothesisClient
from srsly.srsly import SrslyClient

app = bottle.Bottle()

with open("config.json", "r") as f:
    config = json.load(f)
 
h_client = HypothesisClient(config["user"], config["token"])
srsly_client = SrslyClient(h_client)

@app.route('/sync')
def sync():
    return srsly_client.sync()

@app.route('/cards')
def fetch():
    return srsly_client.fetch()

def main():
    bottle.run(app, host='localhost', port=8080, debug=True)
    
if __name__ == "__main__":
    main()
