import BasicCard from "./BasicCard";
import ClozeCard from "./ClozeCard";

function FlashCard(props) {
  if (props.type === "basic") {
    return BasicCard(props);
  } else if (props.type === "cloze") {
    return ClozeCard(props);
  } else {
    return <div>Hello</div>;
  }
}

export default FlashCard;
