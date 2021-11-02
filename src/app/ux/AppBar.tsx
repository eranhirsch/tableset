import AddBoxIcon from "@mui/icons-material/AddBox";
import ClearIcon from "@mui/icons-material/Clear";
import HomeIcon from "@mui/icons-material/Home";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { gameSelector } from "features/game/gameSlice";
import { Link, Route, Switch } from "react-router-dom";
import { OverflowMenu } from "./OverflowMenu";

export function TableSetAppBar(): JSX.Element {
  const game = useAppSelector(gameSelector);

  const gamesLinkTo = `/${game?.id ?? "games"}`;

  return (
    <AppBar position="sticky" sx={{ flexGrow: 0 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Switch>
            <Route path="/games">Games</Route>
            <Route path="/template">Template</Route>
            <Route path="/players">Players</Route>
            <Route path="/collection">{game?.name}: Collection</Route>
            <Route path="/instance">Instance</Route>
            <Route path="/:gameId">{game?.name}</Route>
            <Route path="/">MISSING TITLE</Route>
          </Switch>
        </Typography>
        <Switch>
          <Route path="/template" />
          <Route path="/players" />
          <Route path="/collection">
            <IconButton component={Link} color="inherit" to={gamesLinkTo}>
              <HomeIcon />
            </IconButton>
          </Route>
          <Route path="/instance">
            <IconButton component={Link} color="inherit" to={gamesLinkTo}>
              <ClearIcon />
            </IconButton>
          </Route>
          <Route path="/games" />
          <Route path="/:gameId">
            <IconButton component={Link} color="inherit" to="/collection">
              <AddBoxIcon />
            </IconButton>
          </Route>
        </Switch>
        <OverflowMenu />
      </Toolbar>
    </AppBar>
  );
}
