import { Container } from "@material-ui/core";
import { Template } from "./features/template/Template";
import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <Container maxWidth="xs" component="main">
      <Switch>
        <Route path="/">
          <Template />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
