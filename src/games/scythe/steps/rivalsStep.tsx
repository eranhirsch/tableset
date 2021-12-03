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
      All players may <em>simultaneously</em> declare “rivals” by placing 1 or
      more of their stars on other players’ home bases. They may place up to{" "}
      <strong>{isTriumphEnabled ? 4 : 2}</strong> of their stars this way, and
      they may place multiple stars on the same home base.
    </Typography>
  );
}
