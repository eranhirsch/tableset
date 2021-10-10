import { Container, ThemeProvider } from "@mui/material";
import themeWithGameColors from "app/ux/themeWithGameColors";
import { Expansions } from "features/expansions/Expansions";
import { expansionsActions } from "features/expansions/expansionsSlice";
import Instance from "features/instance/Instance";
import Players from "features/players/Players";
import { playersActions } from "features/players/playersSlice";
import { Template } from "features/template/Template";
import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { TableSetAppBar } from "./TableSetAppBar";

function App(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      // TODO: Remove this when we can load the previous players from somewhere
      ["Eran Hirsch", "Adam Maoz", "Amit Cwajghaft"].forEach((name) =>
        dispatch(playersActions.added(name))
      );
      dispatch(expansionsActions.toggled("base"));
      setIsInitialized(true);
    }
  }, [dispatch, isInitialized]);

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
