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

const ClozeCard = ({ id, text }) => {
  let [phase, setPhase] = useState("question");

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
  let answer = question.slice();
  answer = answer.replace(
    "[...]",
    random_deletion.substring(1, random_deletion.length - 1)
  );

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
        <h1>{answer}</h1>
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
      <h1>{answer}</h1>
      <div>Submitted!</div>
    </div>;
  }
};

export default ClozeCard;
