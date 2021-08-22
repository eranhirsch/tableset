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

function App() {
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
        <Switch>
          <Route path="/template">
            <Template />
          </Route>
          <Route path="/players">
            <Players playerCount={{ min: 2, max: 5 }} />
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
