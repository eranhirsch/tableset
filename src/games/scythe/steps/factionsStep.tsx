import { Chip, Stack, Typography } from "@mui/material";
import { $, Dict, invariant, Random, Shape, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  useHasDownstreamInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import {
  AlwaysNeverMultiChipSelector,
  AlwaysNeverMultiLabel,
} from "games/global/ux/AlwaysNeverMultiChipSelector";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { FactionChip } from "../ux/FactionChip";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";
import { ScytheStepId } from "./ScytheStepId";

type TemplateConfig = {
  always: readonly FactionId[];
  never: readonly FactionId[];
};

export default createRandomGameStep({
  id: "factions",
  dependencies: [playersMetaStep, productsMetaStep, modularBoardVariant],

  isType: (x: unknown): x is readonly FactionId[] =>
    Array.isArray(x) && x.every((fid) => Factions[fid as FactionId] != null),

  isTemplatable: (_players, _products, modularBoardVariant) =>
    modularBoardVariant.canResolveTo(false),

  initialConfig: (): Readonly<TemplateConfig> => ({ always: [], never: [] }),

  resolve(config, players, products, isModular) {
    if (isModular) {
      return null;
    }

    const available = Factions.availableForProducts(products!);

    const randomPool = Vec.diff(
      Vec.diff(available, config.never),
      config.always
    );
    const randomCount = players!.length - config.always.length;
    const random = Random.sample(randomPool, randomCount);
    invariant(
      random.length === randomCount,
      `Mismatch in number of random elements chosen: ${JSON.stringify(
        random
      )}, expected: ${randomCount}`
    );
    return Vec.sort(Vec.concat(config.always, random));
  },

  willContain: (factionId, config) =>
    config != null &&
    (config.always.includes(factionId)
      ? true
      : config.never.includes(factionId)
      ? false
      : undefined),

  refresh({ always, never }, players, products) {
    const available = Factions.availableForProducts(
      products.onlyResolvableValue()!
    );

    if (!Vec.is_empty(Vec.diff(always, available))) {
      // If always has values which are now unavailable, we can't fix the config
      // because we don't know how to fill the gap created by the missing
      // faction trivially (do we just remove it? do we replace it? etc...)
      templateValue("unfixable");
    }

    if (!players.willContainNumElements({ min: always.length })) {
      // There are more values in the always array then there are players, we
      // can't use the array and there's no trivial way to fix it either (what
      // faction do you remove?)
      templateValue("unfixable");
    }

    if (Vec.contained_in(never, available)) {
      // At this point the 'always' array is valid, so if the never array
      // doesn't require any fixing too, we don't need to touch the config.
      templateValue("unchanged");
    }

    // The only case we need to fix is when the 'never' array contains elements
    // which aren't available anymore; for normalization, we want to remove them
    // from the 'never' array too
    return { always, never: Vec.intersect(never, available) };
  },

  skip: (value, [_players, _products, isModular]) =>
    value == null && isModular!,

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,
});

function ConfigPanel({
  config,
  queries: [players, products, isModular],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean
>): JSX.Element {
  const available = useMemo(
    () =>
      Vec.sort(Factions.availableForProducts(products.onlyResolvableValue()!)),
    [products]
  );

  const playersCount = players.onlyResolvableValue()!.length;

  return (
    <Stack spacing={1} alignItems="center">
      <AlwaysNeverMultiChipSelector
        itemIds={available}
        getLabel={(fid) => Factions[fid].name.full}
        getColor={(fid) => Factions[fid].color}
        value={config}
        onChange={onChange}
        limits={{ min: playersCount, max: playersCount }}
      />
      {isModular.canResolveTo(true) && (
        <Typography color="error" variant="caption">
          Ignored when <em>{modularBoardVariant.label}</em> is enabled.
        </Typography>
      )}
    </Stack>
  );
}

function ConfigPanelTLDR({
  config: { always, never },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  if (Vec.is_empty(always) && Vec.is_empty(never)) {
    // Just for consistency with other templatables
    return <>Random</>;
  }

  return (
    <AlwaysNeverMultiLabel
      value={{ always, never }}
      getLabel={(fid) => Factions[fid].name.abbreviated}
      getColor={(fid) => Factions[fid].color}
    />
  );
}

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
  dependencies: [_playerIds, _productIds, _isModular],
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
