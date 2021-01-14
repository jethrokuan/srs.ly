import { Button, Icon } from "semantic-ui-react";

const ClozeCard = ({ phase, card, nextCardHandler, revealButtonHandler }) => {
  let question = card.text.slice();
  const cloze_regex = /\[(.*?)\]/g;
  let deletions = card.text.match(cloze_regex);
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
        <h2>{question}</h2>
        <Button size="huge" onClick={revealButtonHandler}>
          <Icon name="eye" />
          Reveal
        </Button>
      </div>
    );
  } else if (phase === "answer") {
    return (
      <div>
        <h2>{answer}</h2>
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
        <br />
      </div>
    );
  }
};

export default ClozeCard;
