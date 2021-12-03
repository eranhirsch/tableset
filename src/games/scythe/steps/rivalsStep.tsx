import { Typography } from "@mui/material";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import rivalsVariant from "./rivalsVariant";
import warAndPeaceVariant from "./warAndPeaceVariant";

export default createDerivedGameStep({
  id: "rivalsSetup",
  labelOverride: "Rivals: Setup",
  dependencies: [rivalsVariant, warAndPeaceVariant],
  skip: ([isEnabled]) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_isEnabled, isTriumphEnabled],
}: DerivedStepInstanceComponentProps<boolean, boolean>): JSX.Element {
  return (
    <Typography variant="body1">
      Players may declare “rivals” by placing 1 or more of your stars on other
      players’ home bases. You may place up to{" "}
      <strong>{isTriumphEnabled ? 4 : 2}</strong> of your stars this way, and
      you may place multiple stars on the same home base. All players do this
      simultaneously.
    </Typography>
  );
}
