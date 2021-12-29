import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import preludeVariant from "./preludeVariant";

export default createDerivedGameStep({
  id: "playPreludes",
  labelOverride: "Prelude: Play",
  dependencies: [playersMetaStep, preludeVariant],
  skip: ([isPrelude]) => !isPrelude,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, _isPrelude],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <Typography variant="body1" textAlign="justify">
      {isSolo ? (
        <>
          Pick and play <strong>2</strong>
        </>
      ) : (
        <>
          <em>In player order each player</em>: plays their chosen
        </>
      )}{" "}
      Prelude cards and {isSolo ? "discard the" : "discards their"} remaining 2
      <em>
        ; they work like green cards, and stay in play with their tags visible
      </em>
      .
    </Typography>
  );
}
