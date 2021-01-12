import requests
import datetime


class HypothesisClient:
    def __init__(self, user, token):
        self.user = user
        self.token = token
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def get_user_annotations(self, **kwargs):
        endpoint = "https://api.hypothes.is/api/search"
        data = kwargs
        data["limit"] = data.get("limit", 200)
        data["user"] = f"acct:{self.user}@hypothes.is"
        data["tags"] = "srsly"
        res = requests.post(endpoint, data, headers=self.headers).json()
        annotations = [HypothesisAnnotation(row) for row in res["rows"]]
        return annotations


class HypothesisAnnotation:
    def __init__(self, row):
        print(row)
        self.uri = row["uri"]
        self.id = row["id"]
        self.created = datetime.datetime.fromisoformat(row["created"])
        self.updated = datetime.datetime.fromisoformat(row["updated"])
        self.text = row["text"]
        self.card_type = "basic" if "srsly-basic" in row["tags"] else "cloze" 
