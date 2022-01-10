import { Chip, Typography } from "@mui/material";
import { Colors } from "app/utils/Colors";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import friendlyGoalsVariant from "./friendlyGoalsVariant";

export default createDerivedGameStep({
  id: "goalBoard",
  dependencies: [friendlyGoalsVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isFriendly],
}: DerivedStepInstanceComponentProps<boolean>): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Place the <ChosenElement extraInfo="board">Goal</ChosenElement> on the
      table with the{" "}
      <Chip
        size="small"
        color={isFriendly ? "blue" : "green"}
        label={Colors.label(isFriendly ? "blue" : "green")}
      />{" "}
      side that{" "}
      <em>
        {isFriendly
          ? "awards 1 point for each targeted item"
          : "has 1st, 2nd, and 3rd place for each goal"}
      </em>{" "}
      facing up.
    </Typography>
  );
}
