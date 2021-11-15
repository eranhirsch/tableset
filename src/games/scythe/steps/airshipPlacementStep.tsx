import { Typography } from "@mui/material";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import airshipVariant from "./airshipVariant";

export default createDerivedGameStep({
  id: "airshipStartLocation",
  labelOverride: "Airship",

  dependencies: [airshipVariant],

  skip: ([isAirship]) => !isAirship,

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <Typography variant="body1">
      Each players attaches a transparent base to their faction's airship and
      places it on their home base.
    </Typography>
  );
}
