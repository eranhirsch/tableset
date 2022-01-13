import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import oceaniaBirdsVariant from "./oceaniaBirdsVariant";

export default createDerivedGameStep({
  id: "oceaniaReferenceTile",
  labelOverride: "Oceania: Reference Tile",
  dependencies: [oceaniaBirdsVariant],
  skip: ([isOceania]) => !isOceania,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Place the <ChosenElement extraInfo="tile">reference</ChosenElement> near
      the goal mat.
    </Typography>
  );
}
