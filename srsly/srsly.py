import sqlite3
import json
import os
import datetime

class Card:
    def __init__(
        self,
        id,
        card_type,
        difficulty,
        days_between,
        date_last_reviewed,
        percent_overdue,
        text,
        created,
        uri,
        updated,
    ):
        self.id = id
        self.card_type = card_type
        self.difficulty = difficulty
        self.days_between = days_between
        self.date_last_reviewed = date_last_reviewed
        self.percent_overdue = percent_overdue
        self.text = text
        self.created = created
        self.uri = uri
        self.updated = updated

    @staticmethod
    def get(conn, id):
        c = conn.cursor()
        c.execute(
            "SELECT * FROM cards WHERE id=? LIMIT 1",
            (id,),
        )
        (
            id,
            card_type,
            text,
            uri,
            created,
            updated,
            difficulty,
            days_between,
            date_last_reviewed,
            percent_overdue,
        ) = c.fetchone()
        return Card(
            id=id,
            card_type=card_type,
            text=text,
            uri=uri,
            created=created,
            updated=updated,
            difficulty=difficulty,
            days_between=days_between,
            date_last_reviewed=date_last_reviewed,
            percent_overdue=percent_overdue,
        )

    def save(self, conn):
        c = conn.cursor()
        c.execute(
            """UPDATE cards
        SET difficulty = ?,
            days_between = ?,
            date_last_reviewed = ?,
            percent_overdue = ?
        WHERE
            id = ?""",
            (
                self.difficulty,
                self.days_between,
                self.date_last_reviewed,
                self.percent_overdue,
                self.id,
            ),
        )
        conn.commit()

    def review(self, performance_rating):
        """Update review data based on last performance."""
        correct = performance_rating >= 0.6
        now = datetime.datetime.now()
        if self.date_last_reviewed is None:
            self.date_last_reviewed = now
        if correct:
            self.percent_overdue = min(
                2, (now - self.date_last_reviewed) / datetime.timedelta(days=1) / self.days_between
            )
        else:
            self.percent_overdue = 1
        self.difficulty += self.percent_overdue / 17 * (8 - 9 * performance_rating)
        self.difficulty = max(0, min(self.difficulty, 1))  # clamp difficulty to [0, 1]
        difficulty_weight = 3 - 1.7 * self.difficulty
        if correct:
            self.days_between = 1 + (difficulty_weight - 1) * self.percent_overdue
        else:
            self.days_between = max(1, 1 / (difficulty_weight ** 2))
        self.date_last_reviewed = now

    def to_json(self):
        return {
            "id": self.id,
            "text": self.text,
            "card_type": self.card_type,
            "created": self.created.isoformat(),
            "uri": self.uri,
            "updated": self.updated.isoformat(),
            "difficulty": self.difficulty,
            "days_between": self.days_between,
            "date_last_reviewed": self.date_last_reviewed.isoformat() if self.date_last_reviewed else None,
            "percent_overdue": self.percent_overdue,
        }


class SrslyClient:
    def __init__(self, h_client):
        self.h_client = h_client
        self.db = sqlite3.connect(
            os.getenv("DB_LOCATION", "/db/srsly.db"), detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
        )
        self.init_db()

    def init_db(self):
        c = self.db.cursor()
        c.execute(
            """CREATE TABLE IF NOT EXISTS cards
            (id CHAR(250) PRIMARY KEY NOT NULL,
             card_type TEXT NOT NULL,
             text TEXT NOT NULL,
             uri TEXT NOT NULL,
             created TIMESTAMP NOT NULL,
             updated TIMESTAMP NOT NULL,
             difficulty DOUBLE DEFAULT 0.3,
             days_between DOUBLE DEFAULT 3.0,
             date_last_reviewed TIMESTAMP DEFAULT (DATETIME('now', 'localtime')),
             percent_overdue DOUBLE DEFAULT 1
             )"""
            )
        self.db.commit()

    def sync(self):
        """Sync cards with hypothesis."""
        annotations = self.h_client.get_user_annotations()
        c = self.db.cursor()
        for annotation in annotations:
            c.execute(
                """INSERT INTO cards (id, card_type, text, uri, created, updated)
            VALUES(?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
            text=excluded.text,
            updated=excluded.updated,
            card_type=excluded.card_type""",
                (
                    annotation.id,
                    annotation.card_type,
                    annotation.text,
                    annotation.uri,
                    annotation.created,
                    annotation.updated,
                ),
            )
        self.db.commit()
        return {"success": True}

    def review(self, id, rating):
        card = Card.get(self.db, id)
        card.review(rating)
        card.save(self.db)
        return card

    def fetch_review(self):
        """Fetches cards that require reviewing.

        This defaults to at most 20 items, for cards that have not been reviewed
        in the last 8 hours.
        """
        c = self.db.cursor()
        c.execute("""SELECT * FROM cards
        WHERE date_last_reviewed < (DATETIME('now', 'localtime', '-8 hours'))
        OR percent_overdue = 1
        ORDER BY percent_overdue DESC
        LIMIT 20""")
        rows = c.fetchall()
        cards = [
            Card(
                id=id,
                card_type=card_type,
                text=text,
                created=created,
                uri=uri,
                updated=updated,
                difficulty=difficulty,
                days_between=days_between,
                date_last_reviewed=date_last_reviewed,
                percent_overdue=percent_overdue,
            )
            for id, card_type, text, uri, created, updated, difficulty, days_between, date_last_reviewed, percent_overdue in rows
        ]

        return cards


    def fetch_all(self):
        c = self.db.cursor()
        c.execute("""SELECT * FROM cards""")
        rows = c.fetchall()

        cards = [
            Card(
                id=id,
                card_type=card_type,
                text=text,
                created=created,
                uri=uri,
                updated=updated,
                difficulty=difficulty,
                days_between=days_between,
                date_last_reviewed=date_last_reviewed,
                percent_overdue=percent_overdue,
            )
            for id, card_type, text, uri, created, updated, difficulty, days_between, date_last_reviewed, percent_overdue in rows
        ]

        return cards

    def reset_card(self, card_id):
        c = self.db.cursor()
        c.execute(
            """UPDATE cards
               SET difficulty = 0.3,
                   days_between = 3.0,
                   date_last_reviewed = (DATETIME('now')),
                   percent_overdue = 1
               WHERE id = ?
            """, (card_id,))
        self.db.commit()
        return Card.get(self.db, card_id)

    def delete_card(self, card_id):        
        if self.h_client.delete_annotation(card_id):
            c = self.db.cursor()
            c.execute(
                """DELETE FROM cards
                WHERE id = ?""", (card_id,)
            )
            self.db.commit()
            return True
        return False
        
