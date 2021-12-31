import { Chip } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createItemSelectorStep, playersMetaStep } from "games/global";
import { useMemo } from "react";
import coloniesVariant from "./coloniesVariant";
import productsMetaStep from "./productsMetaStep";

const ALL_COLONY_IDS = [
  "callisto",
  "ceres",
  "enceladus",
  "europa",
  "ganymede",
  "io",
  "luna",
  "miranda",
  "pluto",
  "titan",
  "triton",
] as const;
export type ColonyId = typeof ALL_COLONY_IDS[number];
export const SPECIAL_COLONIES: readonly ColonyId[] = [
  "miranda",
  "titan",
  "enceladus",
];

export default createItemSelectorStep({
  id: "colonies",
  enabler: coloniesVariant,
  count,
  productsMetaStep,
  availableForProducts: (productIds) =>
    productIds.includes("colonies") ? ALL_COLONY_IDS : [],
  isItemType: (x: unknown): x is ColonyId =>
    typeof x === "string" && ALL_COLONY_IDS.includes(x as ColonyId),
  labelForId,
  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,
  itemAvroType: {
    type: "enum",
    name: "ColonyId",
    symbols: [...ALL_COLONY_IDS],
  },
});

function InstanceCards({
  value: colonyIds,
  onClick,
}: InstanceCardsProps<readonly ColonyId[]>): JSX.Element {
  return (
    <>
      {Vec.map(colonyIds, (colonyId) => (
        <InstanceCard key={colonyId} onClick={onClick} title="colony">
          <Chip label={labelForId(colonyId)} />
        </InstanceCard>
      ))}
    </>
  );
}

function InstanceVariableComponent({
  value: colonyIds,
}: VariableStepInstanceComponentProps<readonly ColonyId[]>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);

  const isSolo = playerIds.length === 1;

  const specialColonies = useMemo(
    () => Vec.intersect(colonyIds, SPECIAL_COLONIES),
    [colonyIds]
  );

  return (
    <>
      <HeaderAndSteps>
        <>
          Find the colony tiles{" "}
          <GrammaticalList>
            {Vec.map(colonyIds, (colonyId) => (
              <strong key={colonyId}>{labelForId(colonyId)}</strong>
            ))}
          </GrammaticalList>{" "}
        </>
        {isSolo && (
          <>
            <strong>Solo:</strong> discard <strong>1</strong> of them.
          </>
        )}
        <>
          Place the {isSolo && "remaining"} tiles next to the main game board.
        </>
        {!Vec.is_empty(specialColonies) && (
          <>
            <strong>
              for{" "}
              <GrammaticalList>
                {Vec.map(specialColonies, labelForId)}
              </GrammaticalList>
              :
            </strong>{" "}
            place a white cube on the <em>moon picture itself</em>.
          </>
        )}
        <>
          {!Vec.is_empty(specialColonies) ? (
            <>
              <strong>for the rest:</strong> place
            </>
          ) : (
            "Place"
          )}{" "}
          a white cube on the highlighted <em>second step</em> of each Colony
          Tile track.
        </>
      </HeaderAndSteps>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const isSolo = playerIds.length === 1;
  return (
    <>
      <HeaderAndSteps>
        <>
          Shuffle all <strong>{ALL_COLONY_IDS.length}</strong>{" "}
          <ChosenElement extraInfo="tiles">Colony</ChosenElement>.
        </>
        <>Draw {count(playerIds.length)} tiles.</>
        {isSolo && (
          <>
            <strong>Solo:</strong> discard <strong>1</strong> of them.
          </>
        )}
        <>
          Place the {isSolo && "remaining"} tiles next to the main game board.
        </>
        <>
          <strong>for TITAN, ENCELADUS, and MIRANDA:</strong> place a white cube
          on the <em>moon picture itself</em>.
        </>
        <>
          <strong>for the rest:</strong> place a white cube on the highlighted{" "}
          <em>second step</em> of each Colony Tile track.
        </>
      </HeaderAndSteps>
    </>
  );
}

function count(playersCount: number): number {
  return playersCount + (playersCount < 3 ? 3 : 2);
}

export function labelForId(colonyId: ColonyId): string {
  return colonyId.toLocaleUpperCase();
}
