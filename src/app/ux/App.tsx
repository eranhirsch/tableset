import { Container, ThemeProvider } from "@mui/material";
import { themeWithGameColors } from "app/ux/themeWithGameColors";
import { Expansions } from "features/expansions/Expansions";
import { Instance } from "features/instance/Instance";
import { Players } from "features/players/Players";
import { Template } from "features/template/Template";
import { Redirect, Route, Switch } from "react-router-dom";
import { TableSetAppBar } from "./TableSetAppBar";

function App(): JSX.Element | null {
  return (
    <ThemeProvider theme={themeWithGameColors}>
      <TableSetAppBar />
      <Container
        component="main"
        maxWidth="xs"
        sx={{ height: "100vh", position: "relative", paddingTop: 8 }}
      >
        <Switch>
          <Route path="/template">
            <Template />
          </Route>
          <Route path="/players">
            <Players />
          </Route>
          <Route path="/expansions">
            <Expansions />
          </Route>
          <Route path="/instance">
            <Instance />
          </Route>
          <Route path="/">
            <Redirect to="/template" />
          </Route>
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
