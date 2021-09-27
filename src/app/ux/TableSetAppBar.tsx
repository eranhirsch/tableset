import ClearIcon from "@mui/icons-material/Clear";
import PeopleIcon from "@mui/icons-material/People";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TuneIcon from "@mui/icons-material/Tune";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Link, Route, Switch } from "react-router-dom";

export function TableSetAppBar(): JSX.Element | null {
  const templateButton = (
    <IconButton component={Link} color="inherit" to="/template">
      <TuneIcon />
    </IconButton>
  );
  const playersButton = (
    <IconButton component={Link} color="inherit" to="/players">
      <PeopleIcon />
    </IconButton>
  );
  const expansionsButton = (
    <IconButton component={Link} color="inherit" to="/expansions">
      <AddBoxIcon />
    </IconButton>
  );

  return (
    <AppBar position="absolute">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Switch>
            <Route path="/template">Template</Route>
            <Route path="/players">Players</Route>
            <Route path="/expansions">Expansions</Route>
            <Route path="/instance">Instance</Route>
            <Route path="/">MISSING TITLE</Route>
          </Switch>
        </Typography>
        <Switch>
          <Route path="/template">
            {playersButton}
            {expansionsButton}
          </Route>
          <Route path="/players">
            {templateButton}
            {expansionsButton}
          </Route>
          <Route path="/expansions">
            {templateButton}
            {playersButton}
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
