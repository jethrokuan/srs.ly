import sqlite3
import json
import os
import datetime

class SrslyClient():    
    def __init__(self, h_client):
        self.h_client = h_client
        self.db_initialized = os.path.isfile("srsly.db")
        self.db = sqlite3.connect("srsly.db")
        self.init_db()

    def init_db(self):
        if not self.db_initialized:
            c = self.db.cursor()
            c.execute("""CREATE TABLE cards
            (id CHAR(250) PRIMARY KEY NOT NULL,
             text TEXT NOT NULL,
             uri TEXT NOT NULL,
             created TIMESTAMP NOT NULL,
             updated TIMESTAMP NOT NULL,
             difficulty DOUBLE DEFAULT 0.3,
             days_between DOUBLE DEFAULT 0.0,
             date_last_reviewed TIMESTAMP
            )""")
        self.db.commit()

    def sync(self):
        """Sync cards with hypothesis."""
        annotations = self.h_client.get_user_annotations()
        c = self.db.cursor()
        for annotation in annotations:
            print(annotation.text)
            c.execute("""INSERT INTO cards (id, text, uri, created, updated)
            VALUES(?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
            text=excluded.text,
            updated=excluded.updated""",
                      (annotation.id, annotation.text, annotation.uri, annotation.created, annotation.updated))
        self.db.commit()
        return {"success": True}

    def fetch(self):
        c = self.db.cursor()
        c.execute("""SELECT * FROM cards""")
        rows = c.fetchall()

        data = [{
            "id": id,
            "text": text,
            "created": created,
            "uri": uri,
            "updated": updated,
            "difficulty": difficulty,
            "days_between": days_between,
            "date_last_reviewed": date_last_reviewed
        } for id, text, uri, created, updated, difficulty, days_between, date_last_reviewed in rows]

        return {"cards":data}
