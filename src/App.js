import Review from "./Review";
import Cards from "./Cards";
import SyncButton from "./SyncButton";
import { Menu } from "semantic-ui-react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Menu pointing secondary>
        <Menu.Item as={NavLink} to="/">
          Srs.ly
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
          <Review />
        </Route>
        <Route path="/cards">
          <Cards />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
