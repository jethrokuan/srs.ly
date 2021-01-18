import { Button, Icon } from "semantic-ui-react";
import ReviewButtons from "./ReviewButtons";
import ReactMarkdown from "react-markdown";

const BasicCard = ({ phase, card, revealButtonHandler, submitRating }) => {
  const [question, answer] = card.text.split("\n\n");

  if (phase === "question") {
    return (
      <div>
        <section className="card">
          <ReactMarkdown className="question">{question}</ReactMarkdown>
        </section>
        <Button size="huge" onClick={revealButtonHandler}>
          <Icon name="eye" />
          Reveal
        </Button>
      </div>
    );
  } else if (phase === "answer") {
    return (
      <div>
        <section className="card">
          <ReactMarkdown className="question">{question}</ReactMarkdown>
          <ReactMarkdown className="answer">{answer}</ReactMarkdown>
        </section>
        <ReviewButtons submitRating={(rating) => submitRating(rating, card)} />
      </div>
    );
  }
};

export default BasicCard;
