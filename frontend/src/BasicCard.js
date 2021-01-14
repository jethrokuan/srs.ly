import { Button, Icon } from "semantic-ui-react";

const BasicCard = ({ phase, card, nextCardHandler, revealButtonHandler }) => {
  const [question, answer] = card.text.split("\n\n");

  const submitRating = (rating) => {
    fetch("/api/review", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: card.id,
        rating: rating,
      }),
    }).then((response) => {
      nextCardHandler();
    });
  };

  if (phase === "question") {
    return (
      <div>
        <h1>{question}</h1>
        <Button size="huge" onClick={revealButtonHandler}>
          <Icon name="eye" />
          Reveal
        </Button>
      </div>
    );
  } else if (phase === "answer") {
    return (
      <div>
        <h1>{question}</h1>
        <p>{answer}</p>
        <Button.Group>
          <Button size="huge" color="red" onClick={() => submitRating(0.2)}>
            Again
          </Button>
          <Button size="huge" color="grey" onClick={() => submitRating(0.4)}>
            Hard
          </Button>
          <Button size="huge" color="green" onClick={() => submitRating(0.6)}>
            Good
          </Button>
          <Button size="huge" color="blue" onClick={() => submitRating(0.8)}>
            Easy
          </Button>
        </Button.Group>
      </div>
    );
  }
};

export default BasicCard;
