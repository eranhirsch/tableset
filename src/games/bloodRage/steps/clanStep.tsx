import { Chip, Typography } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  useHasDownstreamInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerId } from "features/players/playersSlice";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { createItemSelectorStep, playersMetaStep } from "games/global";
import { useMemo } from "react";
import { ClanId, Clans } from "../utils/Clans";
import productsMetaStep from "./productsMetaStep";

export const clanStep = createItemSelectorStep({
  id: "clanSelection",
  availableForProducts: Clans.availableForProducts,
  productsMetaStep,
  isItemType: Clans.isClanId,
  labelForId: Clans.label,
  getColor: Clans.color,
  count: (playerCount) => playerCount,
  InstanceCards,
  InstanceVariableComponent,
  InstanceManualComponent,
  itemAvroType: Clans.avroType,
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
  dependencies: [_playerIds, productIds, _isEnabled, clanIds],
  onClick,
}: InstanceCardsProps<
  readonly PlayerId[],
  readonly PlayerId[],
  readonly "base"[],
  boolean,
  readonly ClanId[]
>): JSX.Element | null {
  const pairs = useMemo(
    () => Vec.zip(order, clanIds ?? Clans.availableForProducts(productIds!)),
    [clanIds, order, productIds]
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

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const productIds = useRequiredInstanceValue(productsMetaStep);

  return (
    <Typography variant="body1">
      Choose <strong>{playerIds.length}</strong>{" "}
      <ChosenElement>clans</ChosenElement> with which to play with;{" "}
      <em>all clans are mechanically identical</em>:{" "}
      <GrammaticalList finalConjunction="or">
        {Vec.map(Clans.availableForProducts(productIds), (cid) => (
          <Chip
            key={cid}
            size="small"
            color={Clans.color(cid)}
            label={Clans.label(cid)}
          />
        ))}
      </GrammaticalList>
      .
    </Typography>
  );
}