import { Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
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
import factionMatComponentsStep from "./factionMatComponentsStep";
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
  dependencies: [factionIds, isModular, boardType, tilesIdx, homeBasesIdx],
}: DerivedStepInstanceComponentProps<
  readonly FactionId[],
  boolean,
  BoardId,
  number,
  number
>): JSX.Element {
  const manualInstructions = (
    <BlockWithFootnotes
      footnotes={[
        <InstanceStepLink step={factionMatComponentsStep} />,
        <>That aren't lakes.</>,
        <>Directly, with no rivers dividing them.</>,
      ]}
    >
      {(Footnote) => (
        <>
          Players place the remaining <strong>2</strong> workers
          <Footnote index={1} /> on the 2 territories
          <Footnote index={2} /> adjacent to their home-bases
          <Footnote index={3} />
          {((isModular &&
            boardType != null &&
            tilesIdx != null &&
            homeBasesIdx != null) ||
            factionIds != null) &&
            ":"}
        </>
      )}
    </BlockWithFootnotes>
  );

  if (isModular) {
    if (boardType == null || tilesIdx == null || homeBasesIdx == null) {
      return manualInstructions;
    }

    return (
      <HeaderAndSteps synopsis={manualInstructions}>
        {Vec.maybe_map(
          Vec.sort(HomeBases.decode(homeBasesIdx)),
          (fid, homeBaseIdx) =>
            fid === "empty" ? undefined : (
              <ModularFaction
                key={fid}
                factionId={fid}
                homeBaseIdx={homeBaseIdx}
                boardType={boardType}
                tilesIdx={tilesIdx}
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
            {Vec.map(Factions[fid].startingWorkersLocations!, (hexType) => (
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
  tilesIdx,
}: {
  factionId: FactionId;
  boardType: BoardId;
  homeBaseIdx: number;
  tilesIdx: number;
}): JSX.Element {
  const hexTypes = useMemo(
    () =>
      // The home base might be either on the actual board:
      MODULAR_BOARD_WORKER_STARTING_LOCATION[boardType][homeBaseIdx] ??
      // Or on one of the modular map tiles:
      ModularMapTiles.adjacentToHomeBase(
        ModularMapTiles.decode(tilesIdx)[
          ModularMapTiles.tileIdxAtHomeBase(homeBaseIdx)!
        ],
        homeBaseIdx
      )!,
    [boardType, homeBaseIdx, tilesIdx]
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
