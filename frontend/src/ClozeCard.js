import { Button, Icon } from "semantic-ui-react";
import ReviewButtons from "./ReviewButtons";

const ClozeCard = ({ phase, card, revealButtonHandler, submitRating }) => {
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

  if (phase === "question") {
    return (
      <div>
        <section style={{ "margin-bottom": "3rem" }}>
          <h2>{question}</h2>
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
        <section style={{ margin: "2rem 0" }}>
          <h2>{answer}</h2>
        </section>
        <ReviewButtons submitRating={(rating) => submitRating(rating, card)} />
        <br />
      </div>
    );
  }
};

export default ClozeCard;
