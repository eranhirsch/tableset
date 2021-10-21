import { Container, ThemeProvider } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { themeWithGameColors } from "app/ux/themeWithGameColors";
import { Expansions } from "features/expansions/Expansions";
import { expansionsTotalSelector } from "features/expansions/expansionsSlice";
import { Instance } from "features/instance/Instance";
import { Players } from "features/players/Players";
import { playersSelectors } from "features/players/playersSlice";
import { Template } from "features/template/Template";
import { Redirect, Route, Switch } from "react-router-dom";
import { TableSetAppBar } from "./TableSetAppBar";

function App(): JSX.Element | null {
  const playersCount = useAppSelector(playersSelectors.selectTotal);
  const productsCount = useAppSelector(expansionsTotalSelector);

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
          <Route path="/products">
            <Expansions />
          </Route>
          <Route path="/instance">
            <Instance />
          </Route>
          <Route path="/">
            <Redirect
              to={
                playersCount === 0
                  ? "/players"
                  : productsCount === 0
                  ? "/products"
                  : "/template"
              }
            />
          </Route>
        </Switch>
      </Container>
    </ThemeProvider>
  );
}

export default App;
