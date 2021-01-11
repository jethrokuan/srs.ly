import Container from 'react-bootstrap/Container';
import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import SyncButton from './SyncButton';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    }
  }

  componentDidMount() {
    const apiUrl = "/cards";

    fetch(apiUrl)
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.setState({
          cards: data.cards
        })
      }).catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <Container>
        <h1>Srs.ly</h1>
        <SyncButton>Sync</SyncButton>
        {this.state.cards.map((card) => {
          return (<Card style={{ width: '18rem' }} key={card.id}>
                    <Card.Body>
                      <Card.Title>{card.text}</Card.Title>
                      <Card.Text>
                        <a href={card.uri}>{card.uri}</a>
                        {card.id}
                        {card.difficulty}
                      </Card.Text>
                    </Card.Body>
                  </Card>);
        
      })}
      </Container>
  );
  }
}

export default App;
