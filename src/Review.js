import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Icon,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";
import FlashCard from "./FlashCard";

function Review() {
  const [isLoaded, setLoaded] = useState(false);
  const [cards, setCards] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  function getQuestionAnswer(card) {
    if (card["card_type"] == "basic") {
      const text = card["text"];
      const splitIndex = text.indexOf("\n\n");
      const question = text.substring(0, splitIndex).trim();
      const answer = text.substring(splitIndex).trim();
      return [question, answer];
    } else if (card["card_type"] == "cloze") {
      const text = card["text"];
      let question = text.slice();
      const cloze_regex = /\[(.*?)\]/g;
      let deletions = text.match(cloze_regex);
      const random_index = Math.floor(Math.random() * deletions.length);
      const random_deletion = deletions[random_index];
      deletions.splice(random_index, 1);
      for (let i = 0; i < deletions.length; i++) {
        question = question.replace(
          deletions[i],
          deletions[i].substring(1, deletions[i].length - 1)
        );
      }
      question = question.replace(random_deletion, "[...]");
      console.log(question);
      return [question, text];
    } else {
      console.log("Invalid card type " + card["card_type"]);
      return ["", ""];
    }
  }

  useEffect(() => {
    if (!isLoaded) {
      fetch("/review")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCards(data["cards"]);
          setLoaded(true);
          return;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <h1>Loading</h1>;
  } else if (cards.length === 0) {
    return (
      <Grid
        textAlign="center"
        style={{ height: "90vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 750 }}>
          <h1>Nothing to review today</h1>
          <p>Come back later</p>
        </Grid.Column>
      </Grid>
    );
  } else {
    const card = cards[reviewIndex];
    const [question, answer] = getQuestionAnswer(card);
    return (
      <Grid
        textAlign="center"
        style={{ height: "90vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 750 }}>
          <FlashCard type={card.card_type} text={card.text} id={card.id} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default Review;
