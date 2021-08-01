import { Container } from "@material-ui/core";
import Players from "./features/players/Players";
import { Template } from "./features/template/Template";

function App() {
  return (
    <Container maxWidth="xs" component="main">
      <Players />
      <Template />
    </Container>
  );
}

export default App;
