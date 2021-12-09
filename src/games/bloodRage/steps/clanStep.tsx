import { Chip, Typography } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useHasDownstreamInstanceValue } from "features/instance/useInstanceValue";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { createItemSelectorStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { ClanId, Clans } from "../utils/Clans";
import productsMetaStep from "./productsMetaStep";

export const clanStep = createItemSelectorStep({
  id: "clan",
  availableForProducts: () => Clans.ids,
  productsMetaStep,
  isItemType: Clans.isClanId,
  labelForId: Clans.label,
  getColor: Clans.color,
  count: (playerCount) => playerCount,
  InstanceCards,
  InstanceVariableComponent,
  itemAvroType: { type: "enum", name: "ClanId", symbols: [...Clans.ids] },
});

export const playerClanStep = clanStep.createAssignmentStep({
  categoryName: "Clan",
  InstanceCards: PlayerInstanceCards,
});

function InstanceCards({
  value: clanIds,
  onClick,
}: InstanceCardsProps<
  readonly ClanId[],
  readonly PlayerId[],
  readonly "base"[],
  boolean
>): JSX.Element | null {
  const hasAssignments = useHasDownstreamInstanceValue(playerClanStep.id);
  if (hasAssignments) {
    return null;
  }

  return (
    <>
      {Vec.map(clanIds, (clanId) => (
        <InstanceCard key={clanId} onClick={onClick} title="Clan">
          <Chip color={Clans.color(clanId)} label={Clans.label(clanId)} />
        </InstanceCard>
      ))}
    </>
  );
}

function PlayerInstanceCards({
  value: order,
  dependencies: [_playerIds, _productIds, _isEnabled, clanIds],
  onClick,
}: InstanceCardsProps<
  readonly PlayerId[],
  readonly PlayerId[],
  readonly "base"[],
  boolean,
  readonly ClanId[]
>): JSX.Element | null {
  const pairs = useMemo(
    () => Vec.zip(order, clanIds ?? Clans.ids),
    [clanIds, order]
  );
  return (
    <>
      {Vec.map(pairs, ([playerId, clanId]) => (
        <InstanceCard
          key={clanId}
          onClick={onClick}
          title="Clan"
          playerId={playerId}
        >
          <Chip color={Clans.color(clanId)} label={Clans.label(clanId)} />
        </InstanceCard>
      ))}
    </>
  );
}

function InstanceVariableComponent({
  value: clanIds,
}: VariableStepInstanceComponentProps<readonly ClanId[]>): JSX.Element {
  return (
    <Typography variant="body1">
      Use the following clans:{" "}
      <GrammaticalList>
        {Vec.map(clanIds, (clanId) => (
          <Chip
            key={clanId}
            color={Clans.color(clanId)}
            label={Clans.label(clanId)}
          />
        ))}
      </GrammaticalList>
    </Typography>
  );
}
