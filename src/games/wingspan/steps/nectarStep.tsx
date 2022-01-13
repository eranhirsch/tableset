import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { Food } from "../utils/Food";
import oceaniaBirdsVariant from "./oceaniaBirdsVariant";

export default createDerivedGameStep({
  id: "nectar",
  labelOverride: "Oceania: Nectar",
  dependencies: [oceaniaBirdsVariant],
  skip: ([isOceania]) => !isOceania,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Give each player <strong>1</strong>{" "}
      <ChosenElement extraInfo="food token">{Food.LABELS.nectar}</ChosenElement>
      .
    </Typography>
  );
}
