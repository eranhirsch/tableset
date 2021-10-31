import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import TuneIcon from "@mui/icons-material/Tune";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { gameSelector } from "features/game/gameSlice";
import { Link, Route, Switch } from "react-router-dom";
import { OverflowMenu } from "./OverflowMenu";

export function TableSetAppBar(): JSX.Element {
  const game = useAppSelector(gameSelector);

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
  const productsButton = (
    <IconButton component={Link} color="inherit" to="/collection">
      <AddBoxIcon />
    </IconButton>
  );
  const gameHomeButton = (
    <IconButton component={Link} color="inherit" to={`/${game.id}`}>
      <HomeIcon />
    </IconButton>
  );

  return (
    <AppBar position="sticky" sx={{ flexGrow: 0 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Switch>
            <Route path="/games">Games</Route>
            <Route path="/template">Template</Route>
            <Route path="/players">Players</Route>
            <Route path="/collection">Collection</Route>
            <Route path="/instance">Instance</Route>
            <Route path="/">MISSING TITLE</Route>
          </Switch>
        </Typography>
        <Switch>
          <Route path="/template">{playersButton}</Route>
          <Route path="/players">{templateButton}</Route>
          <Route path="/collection">{gameHomeButton}</Route>
          <Route path="/instance">
            <IconButton component={Link} color="inherit" to="/template">
              <ClearIcon />
            </IconButton>
          </Route>
          <Route path="/games" />
          <Route path="/:gameId">{productsButton}</Route>
        </Switch>
        <OverflowMenu />
      </Toolbar>
    </AppBar>
  );
}
