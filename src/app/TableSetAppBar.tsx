import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { Switch, Route, Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import TuneIcon from "@mui/icons-material/Tune";
import ClearIcon from "@mui/icons-material/Clear";

export function TableSetAppBar(): JSX.Element | null {
  return (
    <AppBar position="absolute">
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
