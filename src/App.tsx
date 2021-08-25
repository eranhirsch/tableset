import {
  AppBar,
  Container,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Template from "./features/template/Template";
import { Switch, Route, Redirect, Link } from "react-router-dom";
import themeWithGameColors from "./core/themeWithGameColors";
import Players from "./features/players/Players";
import PeopleIcon from "@material-ui/icons/People";
import TuneIcon from "@material-ui/icons/Tune";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./app/hooks";
import playersSlice from "./features/players/playersSlice";
import Instance from "./features/instance/Instance";
import ClearIcon from "@material-ui/icons/Clear";

function TableSetAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Switch>
            <Route path="/template">Template</Route>
            <Route path="/players">Players</Route>
            <Route path="/instance">Instance</Route>
            <Route path="/">MISSING TITLE</Route>
          </Switch>
        </Typography>
        <Switch>
          <Route path="/template">
            <IconButton component={Link} color="inherit" to="/players">
              <PeopleIcon />
            </IconButton>
          </Route>
          <Route path="/players">
            <IconButton component={Link} color="inherit" to="/template">
              <TuneIcon />
            </IconButton>
          </Route>
          <Route path="/instance/:stepId">
            <IconButton component={Link} color="inherit" to="/instance">
              <ClearIcon />
            </IconButton>
          </Route>
          <Route path="/instance">
            <IconButton component={Link} color="inherit" to="/template">
              <ClearIcon />
            </IconButton>
          </Route>
        </Switch>
      </Toolbar>
    </AppBar>
  );
}

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
