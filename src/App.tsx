import { Container } from "@material-ui/core";
import Template from "./features/template/Template";
import { Switch, Route } from "react-router-dom";
import Players from "./features/players/Players";

function App() {
  return (
    <Container maxWidth="xs" component="main">
      <Switch>
        <Route path="/">
          <Players playerCount={{ min: 2, max: 5 }} />
          <Template />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
