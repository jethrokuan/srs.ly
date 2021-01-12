import { useState } from "react";
import {
  Button,
  TextArea,
  Card,
  Icon,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment,
} from "semantic-ui-react";

const BasicCard = ({ id, text }) => {
  let [phase, setPhase] = useState("question");

  const [question, answer] = text.split("\n\n");

  const revealAnswer = () => {
    setPhase("answer");
  };

  const submitRating = (rating) => {
    fetch("/review", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        rating: rating,
      }),
    }).then((response) => {
      alert("Card Reviewed!");
    });
  };

  if (phase === "question") {
    return (
      <div>
        <h1>{question}</h1>
        <Button animated onClick={revealAnswer}>
          <Button.Content hidden>Reveal</Button.Content>
          <Button.Content visible>
            <Icon name="eye" />
          </Button.Content>
        </Button>
      </div>
    );
  } else if (phase === "answer") {
    return (
      <div>
        <h1>{question}</h1>
        <p>{answer}</p>
        <Button.Group>
          <Button color="red" onClick={() => submitRating(0.2)}>
            Again
          </Button>
          <Button color="grey" onClick={() => submitRating(0.4)}>
            Hard
          </Button>
          <Button color="green" onClick={() => submitRating(0.6)}>
            Good
          </Button>
          <Button color="blue" onClick={() => submitRating(0.8)}>
            Easy
          </Button>
        </Button.Group>
      </div>
    );
  } else {
    <div>
      <h1>{question}</h1>
      <p>{answer}</p>
      <div>Submitted!</div>
    </div>;
  }
};

export default BasicCard;
