import { Button } from "semantic-ui-react";

const ReviewButtons = ({ submitRating }) => {
  return (
    <Button.Group size="large">
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
  );
};

export default ReviewButtons;
