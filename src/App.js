import { useState } from "react";
import Review from "./Review";
import Cards from "./Cards";
import SyncButton from "./SyncButton";
import { Menu } from "semantic-ui-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Menu pointing secondary>
        <Menu.Item as={Link} to="/">
          Srs.ly
        </Menu.Item>
        <Menu.Item as={NavLink} to="/review">
          Review
        </Menu.Item>
        <Menu.Item as={NavLink} to="/cards">
          Cards
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item name="sync">
            <SyncButton>Sync</SyncButton>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/review">
          <Review />
        </Route>
        <Route path="/cards">
          <Cards />
        </Route>
      </Switch>
    </Router>
  );
}

function Home() {
  return <p>Hello</p>;
}

export default App;
