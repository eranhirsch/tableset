import { Container } from "@mui/material";
import { ReactUtils } from "common";
import { Collection } from "features/collection/Collection";
import { GameHomeWrapper } from "features/game/GameHome";
import { Games } from "features/game/Games";
import { Instance } from "features/instance/Instance";
import { Players } from "features/players/Players";
import { Template } from "features/template/Template";
import { Route, Switch } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import { RootRedirector } from "./RootRedirector";

export function Main(): JSX.Element {
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        flexGrow: 1,
        position: "relative",
        ...ReactUtils.SX_SCROLL_WITHOUT_SCROLLBARS,
      }}
    >
      <Switch>
        <Route path="/games">
          <ErrorBoundary slice="game">
            <Games />
          </ErrorBoundary>
        </Route>
        <Route path="/template">
          <ErrorBoundary slice="template">
            <Template />
          </ErrorBoundary>
        </Route>
        <Route path="/players">
          <ErrorBoundary slice="players">
            <Players />
          </ErrorBoundary>
        </Route>
        <Route path="/collection">
          <ErrorBoundary slice="collection">
            <Collection />
          </ErrorBoundary>
        </Route>
        <Route path="/instance">
          <ErrorBoundary slice="instance">
            <Instance />
          </ErrorBoundary>
        </Route>
        <Route path="/:gameId">
          <GameHomeWrapper />
        </Route>
        <Route path="/">
          <RootRedirector />
        </Route>
      </Switch>
    </Container>
  );
}
