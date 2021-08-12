import { Container, ThemeProvider } from "@material-ui/core";
import Template from "./features/template/Template";
import { Switch, Route } from "react-router-dom";
import Players from "./features/players/Players";
import themeWithGameColors from "./core/themeWithGameColors";

function App() {
  return (
    <ThemeProvider theme={themeWithGameColors}>
      <Container maxWidth="xs" component="main">
        <Switch>
          <Route path="/">
            <Players playerCount={{ min: 2, max: 5 }} />
            <Template />
          </Route>
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
