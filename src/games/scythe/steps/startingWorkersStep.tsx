import { Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React, { useMemo } from "react";
import { FactionId, Factions } from "../utils/Factions";
import { HexType, HEX_TYPE_LABEL } from "../utils/HexType";
import { HomeBases } from "../utils/HomeBases";
import { ModularMapTiles } from "../utils/ModularMapTiles";
import { FactionChip } from "../ux/FactionChip";
import boardStep, { BoardId } from "./boardStep";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
import modularTilesStep from "./modularTilesStep";

const MODULAR_BOARD_WORKER_STARTING_LOCATION: Readonly<
  Record<BoardId, readonly (undefined | [HexType, HexType])[]>
> = {
  farms: [
    ["mountain", "village"],
    undefined,
    ["forest", "farm"],
    undefined,
    ["village", "farm"],
    undefined,
    ["mountain", "village"],
  ],
  noFarms: [
    ["mountain", "tundra"],
    undefined,
    ["mountain", "village"],
    undefined,
    ["forest", "village"],
    undefined,
    ["forest", "tundra"],
  ],
};

export default createDerivedGameStep({
  id: "startingWorkers",
  dependencies: [
    factionsStep,
    modularBoardVariant,
    boardStep,
    modularTilesStep,
    modularHomeBasesStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [factionIds, isModular, boardType, tilesHash, homeBasesHash],
}: DerivedStepInstanceComponentProps<
  readonly FactionId[],
  boolean,
  BoardId,
  string,
  string
>): JSX.Element {
  const manualInstructions = (
    <BlockWithFootnotes
      footnotes={[
        <>That aren't lakes.</>,
        <>Directly, with no rivers dividing them.</>,
      ]}
    >
      {(Footnote) => (
        <>
          Players place <strong>1</strong> worker on each of exactly{" "}
          <strong>2</strong> territories
          <Footnote index={1} /> adjacent to their home-base
          <Footnote index={2} />
          {((isModular &&
            boardType != null &&
            tilesHash != null &&
            homeBasesHash != null) ||
            factionIds != null) &&
            ":"}
        </>
      )}
    </BlockWithFootnotes>
  );

  if (isModular) {
    if (boardType == null || tilesHash == null || homeBasesHash == null) {
      return manualInstructions;
    }

    return (
      <HeaderAndSteps synopsis={manualInstructions}>
        {Vec.maybe_map(HomeBases.decode(homeBasesHash), (fid, homeBaseIdx) =>
          fid === "empty" ? undefined : (
            <ModularFaction
              key={fid}
              factionId={fid}
              homeBaseIdx={homeBaseIdx}
              boardType={boardType}
              tilesHash={tilesHash}
            />
          )
        )}
      </HeaderAndSteps>
    );
  }

  if (factionIds == null) {
    return manualInstructions;
  }

  return (
    <HeaderAndSteps synopsis={manualInstructions}>
      {Vec.map(factionIds, (fid) => (
        <React.Fragment key={fid}>
          <FactionChip key={fid} factionId={fid} />:{" "}
          <GrammaticalList>
            {Vec.map(Factions[fid].startingWorkersLocations, (hexType) => (
              <em key={`${fid}_${hexType}`}>{HEX_TYPE_LABEL[hexType]}</em>
            ))}
          </GrammaticalList>
        </React.Fragment>
      ))}
    </HeaderAndSteps>
  );
}

function ModularFaction({
  factionId,
  boardType,
  homeBaseIdx,
  tilesHash,
}: {
  factionId: FactionId;
  boardType: BoardId;
  homeBaseIdx: number;
  tilesHash: string;
}): JSX.Element {
  const hexTypes = useMemo(
    () =>
      MODULAR_BOARD_WORKER_STARTING_LOCATION[boardType][homeBaseIdx] ??
      ModularMapTiles.adjacentToHomeBase(
        ModularMapTiles.decode(tilesHash).find(
          (_, tileIdx) =>
            ModularMapTiles.homeBaseIdxAtTile(tileIdx) === homeBaseIdx
        )!,
        homeBaseIdx
      )!,
    [boardType, homeBaseIdx, tilesHash]
  );

  return (
    <>
      For <FactionChip factionId={factionId} />:{" "}
      <GrammaticalList>
        {Vec.map(hexTypes, (hexType) => (
          <em key={`${factionId}_${hexType}`}>{HEX_TYPE_LABEL[hexType]}</em>
        ))}
      </GrammaticalList>
    </>
  );
}
