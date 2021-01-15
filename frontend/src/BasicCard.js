import { Button, Icon } from "semantic-ui-react";
import ReviewButtons from "./ReviewButtons";

const BasicCard = ({ phase, card, revealButtonHandler, submitRating }) => {
  const [question, answer] = card.text.split("\n\n");

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
        <ReviewButtons submitRating={(rating) => submitRating(rating, card)} />
      </div>
    );
  }
};

export default BasicCard;
