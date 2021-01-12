import { useState, useEffect } from "react";
import { Table, Label, Container, Button, Card } from "semantic-ui-react";
import { Link } from "react-router-dom";

function Cards() {
  const [cards, setCards] = useState([]);

  const resetCard = (id) => {
    fetch(`/card/${id}/reset`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        alert("Card Reset!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetch("/cards")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCards(data["cards"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Card Type</Table.HeaderCell>
            <Table.HeaderCell>Text</Table.HeaderCell>
            <Table.HeaderCell>Uri</Table.HeaderCell>
            <Table.HeaderCell>SM2 Details</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {cards.map((card) => {
            return (
              <Table.Row>
                <Table.Cell>{card.id}</Table.Cell>
                <Table.Cell>{card.card_type}</Table.Cell>
                <Table.Cell>{card.text}</Table.Cell>
                <Table.Cell>
                  <Link to={card.uri}>{card.uri}</Link>
                </Table.Cell>
                <Table.Cell>
                  <ul>
                    <li>
                      <b>% overdue:</b> {card.percent_overdue}
                    </li>
                    <li>
                      <b>difficulty:</b> {card.difficulty}
                    </li>
                    <li>
                      <b>days between:</b> {card.days_between}
                    </li>
                    <li>
                      <b>date last reviewed:</b> {card.date_last_reviewed}
                    </li>
                  </ul>
                </Table.Cell>
                <Table.Cell>
                  <Button.Group vertical>
                    <Button color="blue" onClick={() => resetCard(card.id)}>
                      Reset
                    </Button>
                    <Button color="red">Delete</Button>
                  </Button.Group>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}

export default Cards;
