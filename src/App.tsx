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
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import playersSlice from "./features/players/playersSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // TODO: Remove this when we can load the previous players from somewhere
    ["Eran Hirsch", "Adam Maoz", "Amit Cwajghaft"].forEach((name) =>
      dispatch(playersSlice.actions.added({ name }))
    );
  }, [dispatch]);

  return (
    <ThemeProvider theme={themeWithGameColors}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ height: "100vh", position: "relative" }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Switch>
                <Route path="/template">Template</Route>
                <Route path="/players">Players</Route>
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
            </Switch>
          </Toolbar>
        </AppBar>
        <section>
          <Switch>
            <Route path="/template">
              <Template />
            </Route>
            <Route path="/players">
              <Players />
            </Route>
            <Route path="/">
              <Redirect to="/template" />
            </Route>
          </Switch>
        </section>
      </Container>
    </ThemeProvider>
  );
}

export default App;
