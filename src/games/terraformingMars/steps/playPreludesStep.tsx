import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import preludeVariant from "./preludeVariant";

export default createDerivedGameStep({
  id: "playPreludes",
  labelOverride: "Prelude: Play",
  dependencies: [preludeVariant],
  skip: ([isPrelude]) => !isPrelude,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      <em>In player order each player</em>: plays their Prelude cards and
      discards their remaining 2 Prelude cards. They work like green cards, and
      stay in play with their tags visible.
    </Typography>
  );
}
