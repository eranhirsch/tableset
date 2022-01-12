import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import { SWIFT_START } from "./swiftStartGuidesSteps";
import swiftStartVariant from "./swiftStartVariant";

export default createDerivedGameStep({
  id: "keepBonusCard",
  dependencies: [playersMetaStep, swiftStartVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isSwiftStart],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Chose <strong>1</strong> bonus card to keep, and discard the other
      {!isSwiftStart ||
        (playerIds!.length > SWIFT_START.length && (
          <>
            ;{" "}
            <em>
              You may look at your bonus cards while selecting which birds to
              keep (and vice versa)
            </em>
          </>
        ))}
      .
    </Typography>
  );
}
