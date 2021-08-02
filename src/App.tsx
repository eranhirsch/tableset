import { Container } from "@material-ui/core";
import { Template } from "./features/template/Template";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Container maxWidth="xs" component="main">
      <Router>
        <Switch>
          <Route path="/">
            <Template />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}

export default App;
