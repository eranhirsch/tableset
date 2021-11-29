import { Chip, Stack, Typography } from "@mui/material";
import { $, Dict, Shape, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  useHasDownstreamInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createItemSelectorStep, playersMetaStep } from "games/global";
import createNegateMetaStep from "games/global/steps/createNegateMetaStep";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { FactionChip } from "../ux/FactionChip";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";
import { ScytheStepId } from "./ScytheStepId";

export default createItemSelectorStep({
  id: "factions",
  enabler: createNegateMetaStep(modularBoardVariant),

  availableForProducts: Factions.availableForProducts,

  productsMetaStep,

  count: (playersCount) => playersCount,

  isItemType: (x: unknown): x is FactionId => Factions[x as FactionId] != null,

  labelForId: (fid) => Factions[fid].name.short,
  getColor: (fid) => Factions[fid].color,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,

  itemAvroType: {
    type: "enum",
    name: "FactionId",
    symbols: [...Factions.ALL_IDS],
  },
});

function InstanceVariableComponent({
  value: factionIds,
}: VariableStepInstanceComponentProps<readonly FactionId[]>): JSX.Element {
  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <Typography variant="body1" sx={{ width: "100%" }}>
        The factions are:
      </Typography>
      <Stack spacing={1} direction="column" textAlign="center">
        {React.Children.toArray(
          Vec.map_with_key(
            Shape.select_keys(Factions, factionIds),
            (_, { name: { full }, color }) => (
              <Chip color={color} label={full} />
            )
          )
        )}
      </Stack>
    </Stack>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const productIds = useRequiredInstanceValue(productsMetaStep);

  const factionIds = useMemo(
    () => Factions.availableForProducts(productIds),
    [productIds]
  );

  return (
    <HeaderAndSteps synopsis="Select factions:">
      <BlockWithFootnotes
        footnotes={[
          <>
            The boards with the faction logo at the top left, and the leader and
            faction name next to it.
          </>,
          <>
            The factions are:{" "}
            <GrammaticalList>
              {Vec.map(factionIds, (fid) => (
                <FactionChip key={fid} factionId={fid} />
              ))}
            </GrammaticalList>
            .
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Shuffle all faction mats
            <Footnote index={1} />
            <Footnote index={2} />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Randomly draw <strong>{playerIds.length}</strong> mats;{" "}
        <em>one per player</em>.
      </>
    </HeaderAndSteps>
  );
}

function InstanceCards({
  value: factionIds,
  onClick,
}: InstanceCardsProps<
  readonly FactionId[],
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean
>): JSX.Element | null {
  const willRenderPlayerMatsCards = useHasDownstreamInstanceValue(
    ScytheStepId.MATS
  );
  const willRenderAssignments = useHasDownstreamInstanceValue(
    ScytheStepId.FACTION_ASSIGNMENTS
  );
  if (willRenderPlayerMatsCards || willRenderAssignments) {
    // We render the factions information as part of the player mats step so we
    // can drop these cards.
    return null;
  }

  return (
    <>
      {$(
        Dict.from_keys(factionIds, (fid) => Factions[fid]),
        ($$) =>
          Vec.map_with_key($$, (fid, { color, name: { short } }) => (
            <InstanceCard key={fid} title="Faction" onClick={onClick}>
              <Chip label={short} color={color} />
            </InstanceCard>
          ))
      )}
    </>
  );
}
