import BasicCard from "./BasicCard";
import ClozeCard from "./ClozeCard";

function FlashCard(props) {
  if (props.card.card_type === "basic") {
    return BasicCard(props);
  } else if (props.card.card_type === "cloze") {
    return ClozeCard(props);
  } else {
    console.log("Error! Bad card type" + props.card.card_type);
  }
}

export default FlashCard;
