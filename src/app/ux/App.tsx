import { Container, ThemeProvider } from "@mui/material";
import { themeWithGameColors } from "app/ux/themeWithGameColors";
import { Products } from "features/expansions/Expansions";
import { Instance } from "features/instance/Instance";
import { Players } from "features/players/Players";
import { Template } from "features/template/Template";
import { Route, Switch } from "react-router-dom";
import { TableSetAppBar } from "./AppBar";
import { ErrorBoundary } from "./ErrorBoundary";
import { RootRedirector } from "./RootRedirector";

function App(): JSX.Element | null {
  return (
    <ThemeProvider theme={themeWithGameColors}>
      <ErrorBoundary>
        <TableSetAppBar />
        <Container
          component="main"
          maxWidth="xs"
          sx={{ height: "100vh", position: "relative", paddingTop: 8 }}
        >
          <Switch>
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
            <Route path="/products">
              <ErrorBoundary slice="expansions">
                <Products />
              </ErrorBoundary>
            </Route>
            <Route path="/instance">
              <ErrorBoundary slice="instance">
                <Instance />
              </ErrorBoundary>
            </Route>
            <Route path="/">
              <RootRedirector />
            </Route>
          </Switch>
        </Container>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
