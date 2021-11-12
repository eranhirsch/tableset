import { C, Dict, Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { HomeBases } from "../utils/HomeBases";
import { playerAssignmentIds } from "../utils/playerAssignments";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "factionMatComponents",
  labelOverride: "Faction Mat Setup",

  dependencies: [
    playersMetaStep,
    productsMetaStep,
    factionsStep,
    playerAssignmentsStep,
    modularBoardVariant,
    modularHomeBasesStep,
  ],

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    playerIds,
    productIds,
    factionIds,
    order,
    isModular,
    homeBasesHash,
  ],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[],
  readonly PlayerId[],
  boolean,
  string
>): JSX.Element {
  const actualFactionIds = useMemo(
    () =>
      factionIds != null
        ? factionIds
        : homeBasesHash != null
        ? HomeBases.decode(homeBasesHash)
        : Factions.availableForProducts(productIds!),
    [factionIds, homeBasesHash, productIds]
  );

  return (
    <HeaderAndSteps
      synopsis={
        <>
          Players set up their <em>faction mat</em>:
        </>
      }
    >
      {actualFactionIds.includes("crimea") &&
        playerIds!.length > 5 &&
        !isModular && (
          <>
            <FactionSpecific
              factionId="crimea"
              order={order}
              factionIds={factionIds}
              productIds={productIds!}
            />
            : Cover the printed{" "}
            <strong>
              {/* spell-checker: disable */}Wayfare{/* spell-checker: enable */}
            </strong>{" "}
            mech ability with the cardboard circular token:{" "}
            <em>"move to any unoccupied farm"</em>.
          </>
        )}
      {actualFactionIds.includes("polania") && playerIds!.length > 5 && (
        <>
          <FactionSpecific
            factionId="polania"
            order={order}
            factionIds={factionIds}
            productIds={productIds!}
          />
          : Cover the printed{" "}
          <strong>
            {/* spell-checker: disable */}Meander{/* spell-checker: enable */}
          </strong>{" "}
          faction ability with the replacement cardboard <em>Meander</em> token.
        </>
      )}
      <>
        <strong>Mech Miniatures (plastic) (4):</strong> covering the large
        circles.
      </>
      <>
        <strong>Stars (wooden) (6)</strong>: near the faction logo, at the top
        left corner.
      </>
      {actualFactionIds.includes("albion") && (
        <>
          <FactionSpecific
            factionId="albion"
            order={order}
            factionIds={factionIds}
            productIds={productIds!}
          />
          : <strong>Flag chits (cardboard) (4)</strong>.
        </>
      )}
      {actualFactionIds.includes("togawa") && (
        <>
          <FactionSpecific
            factionId="togawa"
            order={order}
            factionIds={factionIds}
            productIds={productIds!}
          />
          : <strong>Trap chits (cardboard) (4):</strong> placing them face-down
          on the side showing the togawa logo.
        </>
      )}
      <BlockWithFootnotes footnote={<>These are enlist bonuses.</>}>
        {(Footnote) => (
          <>
            Leave the 4 smaller circles on the bottom left side of the mat
            <Footnote /> clear of any components and visible.
          </>
        )}
      </BlockWithFootnotes>
    </HeaderAndSteps>
  );
}

function FactionSpecific({
  factionId,
  order,
  factionIds,
  productIds,
}: {
  factionId: FactionId;
  order: readonly PlayerId[] | null | undefined;
  factionIds: readonly FactionId[] | null | undefined;
  productIds: readonly ScytheProductId[];
}): JSX.Element {
  const assignedIds = useMemo(
    () =>
      order == null || factionIds == null
        ? null
        : playerAssignmentIds(
            order,
            null /* playerMatsHash */,
            factionIds,
            productIds!
          ),
    [factionIds, order, productIds]
  );

  return assignedIds != null ? (
    <PlayerAvatar
      playerId={C.onlyx(
        Vec.keys(Dict.filter(assignedIds, ([fid]) => fid === factionId))
      )}
      inline
    />
  ) : (
    <>
      {factionIds == null && "If "}
      <FactionChip factionId={factionId} />
      {factionIds == null && " are playing"}
    </>
  );
}
