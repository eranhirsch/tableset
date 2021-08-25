import { Container, ThemeProvider } from "@material-ui/core";
import Template from "../features/template/Template";
import { Switch, Route, Redirect } from "react-router-dom";
import themeWithGameColors from "../core/themeWithGameColors";
import Players from "../features/players/Players";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./hooks";
import playersSlice from "../features/players/playersSlice";
import Instance from "../features/instance/Instance";
import { TableSetAppBar } from "./TableSetAppBar";

function App() {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // TODO: Remove this when we can load the previous players from somewhere
      ["Eran Hirsch", "Adam Maoz", "Amit Cwajghaft"].forEach((name) =>
        dispatch(playersSlice.actions.added(name))
      );
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

  return (
    <ThemeProvider theme={themeWithGameColors}>
      <TableSetAppBar />
      <Container
        component="main"
        maxWidth="xs"
        sx={{ height: "100vh", position: "relative" }}
      >
        <Switch>
          <Route path="/template">
            <Template />
          </Route>
          <Route path="/players">
            <Players />
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
