import { Container, ThemeProvider } from "@material-ui/core";
import Template from "./features/template/Template";
import { Switch, Route } from "react-router-dom";
import themeWithGameColors from "./core/themeWithGameColors";

function App() {
  return (
    <ThemeProvider theme={themeWithGameColors}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ height: "100vh", position: "relative" }}
      >
        <Switch>
          <Route path="/">
            <Template />
          </Route>
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
