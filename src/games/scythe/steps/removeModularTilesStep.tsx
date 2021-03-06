import { Typography } from "@mui/material";
import { Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { FactionId } from "../utils/Factions";
import { HomeBases } from "../utils/HomeBases";
import { ModularMapTiles } from "../utils/ModularMapTiles";
import { FactionChip } from "../ux/FactionChip";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";

export default createDerivedGameStep({
  id: "removeTiles",

  dependencies: [playersMetaStep, modularBoardVariant, modularHomeBasesStep],

  skip: ([players, isModular]) =>
    !isModular ||
    // If the number of players doesn't require removing tiles, we can simply
    // skip the step.
    ModularMapTiles.inPlay(players!.length) >= ModularMapTiles.MAX_IN_PLAY,

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, _, homeBasesIdx],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean,
  number
>): JSX.Element {
  const homeBases = useMemo(
    () => (homeBasesIdx == null ? null : HomeBases.decode(homeBasesIdx)),
    [homeBasesIdx]
  );

  const removeCount =
    ModularMapTiles.MAX_IN_PLAY - ModularMapTiles.inPlay(playerIds!.length);
  const description = (
    <>
      For a tighter <em>and fairer</em> game you should remove{" "}
      {removeCount > 1 && "up to "}
      <strong>{removeCount}</strong> tile{removeCount > 1 && "s"} from the board
    </>
  );

  if (homeBases == null) {
    return <Typography variant="body1">{description}.</Typography>;
  }

  const emptyPos = homeBases.indexOf("empty");

  return (
    <HeaderAndSteps synopsis={<>{description}:</>}>
      {Vec.rotate(
        [
          <TileSuggestion
            label="top left"
            bases={[homeBases[6], homeBases[7], homeBases[0]]}
          />,
          <TileSuggestion
            label="top right"
            bases={[homeBases[0], homeBases[1], homeBases[2]]}
          />,
          <TileSuggestion
            label="bottom right"
            bases={[homeBases[2], homeBases[3], homeBases[4]]}
          />,
          <TileSuggestion
            label="bottom left"
            bases={[homeBases[4], homeBases[5], homeBases[6]]}
          />,
        ],
        // We rotate the suggestions based on where the empty cell is so that
        // the suggestions which are more likely to be used show up first.
        emptyPos > 0 ? -Math.ceil(emptyPos / 2) : 0
      )}
    </HeaderAndSteps>
  );
}

function TileSuggestion({
  label,
  bases,
}: {
  label: string;
  bases: [FactionId | "empty", FactionId | "empty", FactionId | "empty"];
}): JSX.Element {
  return (
    <>
      {bases[1] === "empty" ? (
        <strong>Consider</strong>
      ) : (
        <>
          If no one picked <FactionChip factionId={bases[1]} />: consider
        </>
      )}{" "}
      the <em>{label}</em> tile; If no one also didn't pick{" "}
      <GrammaticalList finalConjunction="or">
        {Vec.map(
          Vec.filter(
            [bases[0], bases[2]],
            (fid): fid is FactionId => fid !== "empty"
          ),
          (fid) => (
            <FactionChip factionId={fid} />
          )
        )}
      </GrammaticalList>{" "}
      you should strongly consider it.
    </>
  );
}
