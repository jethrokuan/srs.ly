import { useState, useEffect } from "react";
import { Loader, Grid, Placeholder } from "semantic-ui-react";
import FlashCard from "./FlashCard";

function Review() {
  const [isLoaded, setLoaded] = useState(false);
  const [phase, setPhase] = useState("question");
  const [cards, setCards] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);

  const nextCardHandler = () => {
    setPhase("question");
    if (reviewIndex === cards.length - 1) {
      setLoaded(false);
    } else {
      setReviewIndex(reviewIndex + 1);
    }
  };

  const submitRating = (rating, card) => {
    fetch(`/api/card/${card.id}/review`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
      }),
    }).then((response) => {
      nextCardHandler();
    });
  };

  useEffect(() => {
    if (!isLoaded) {
      fetch("/api/review")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setCards(data["cards"]);
          setReviewIndex(0);
          setLoaded(true);
          return;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoaded]);

  const revealAnswer = () => {
    setPhase("answer");
  };

  if (isLoaded && cards.length === 0) {
    return (
      <Grid
        textAlign="center"
        style={{ height: "90vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 750 }}>
          <h1>All done for now!</h1>
          <p>Come back later.</p>
        </Grid.Column>
      </Grid>
    );
  } else {
    const card = cards[reviewIndex];
    return (
      <Grid
        textAlign="center"
        style={{ height: "90vh" }}
        verticalAlign="middle"
      >
        <Grid.Row>
          <Grid.Column style={{ maxWidth: 750 }}>
            <p style={{ color: "rgba(0,0,0,0.6)" }}>
              Card {reviewIndex + 1} of {cards.length} (
              {card ? <a href={card.uri}>Source</a> : <span />})
            </p>
            <Loader active={!isLoaded} />
            {isLoaded && card ? (
              <FlashCard
                card={card}
                phase={phase}
                revealButtonHandler={revealAnswer}
                submitRating={submitRating}
              />
            ) : (
              <Placeholder>
                <Placeholder.Header />
                <Placeholder.Line />
                <Placeholder.Line />
              </Placeholder>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Review;
