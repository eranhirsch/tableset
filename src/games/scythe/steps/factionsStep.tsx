import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { $, Dict, invariant, Random, Shape, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { playersSelectors } from "features/players/playersSlice";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { FactionChip } from "../ux/FactionChip";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";

type TemplateConfig = {
  always: readonly FactionId[];
  never: readonly FactionId[];
};

type Mode = "always" | "never" | "random";

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

  return (
    <Stack spacing={1} alignItems="center">
      <FactionsSelector
        factionIds={available}
        factionMode={(fid) => currentMode(config, fid)}
        onChange={(fid) =>
          onChange((current) =>
            switchModes(
              current,
              fid,
              currentMode(current, fid),
              nextMode(current, fid, players, available.length)
            )
          )
        }
      />
      {isModular.canResolveTo(true) && (
        <Typography color="error" variant="caption">
          Ignored when <em>{modularBoardVariant.label}</em> is enabled.
        </Typography>
      )}
    </Stack>
  );
}

function FactionsSelector({
  factionIds,
  factionMode,
  onChange,
}: {
  factionIds: readonly FactionId[];
  factionMode(factionId: FactionId): Mode;
  onChange(factionId: FactionId): void;
}): JSX.Element {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
      {Vec.map(factionIds, (factionId) => (
        <FactionSelector
          key={factionId}
          factionId={factionId}
          mode={factionMode(factionId)}
          onClick={() => onChange(factionId)}
        />
      ))}
    </Box>
  );
}

function FactionSelector({
  factionId,
  mode,
  onClick,
}: {
  factionId: FactionId;
  mode: "always" | "never" | "random";
  onClick(): void;
}): JSX.Element {
  const { name, color } = Factions[factionId];
  return (
    <Chip
      sx={{
        opacity: mode === "never" ? 0.75 : 1.0,
        marginX:
          mode === "random" ? "14px" : mode === "never" ? "4px" : undefined,
      }}
      color={color}
      icon={
        mode === "always" ? (
          <CheckCircleIcon fontSize="small" />
        ) : mode === "never" ? (
          <NotInterestedRoundedIcon fontSize="small" />
        ) : undefined
      }
      variant={mode === "never" ? "outlined" : "filled"}
      label={
        mode === "always" ? (
          <strong>{name}</strong>
        ) : mode === "never" ? (
          <em>{name}</em>
        ) : (
          name
        )
      }
      onClick={onClick}
    />
  );
}

function ConfigPanelTLDR({
  config: { always, never },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  const playersCount = useAppSelector(playersSelectors.selectTotal);

  if (Vec.is_empty(always) && Vec.is_empty(never)) {
    // Just for consistency with other templatables
    return <>Random</>;
  }

  const unassignedCount = playersCount - always.length;

  return (
    <GrammaticalList>
      {Vec.concat(
        Vec.map_with_key(
          Shape.select_keys(Factions, always),
          (fid, { name: { abbreviated }, color }) => (
            <Chip
              key={fid}
              component="span"
              color={color}
              size="small"
              label={`${abbreviated}.`}
            />
          )
        ),
        unassignedCount > 0
          ? [
              <>
                {unassignedCount} random faction
                {unassignedCount > 1 && "s"}
                {!Vec.is_empty(never) && (
                  <>
                    {" "}
                    (but not{" "}
                    <GrammaticalList finalConjunction="or">
                      {React.Children.toArray(
                        Vec.map(
                          never,
                          (fid) => `${Factions[fid].name.abbreviated}.`
                        )
                      )}
                    </GrammaticalList>
                    )
                  </>
                )}
              </>,
            ]
          : []
      )}
    </GrammaticalList>
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
            (_, { name, color }) => <Chip color={color} label={name} />
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
}: InstanceCardsProps<
  readonly FactionId[],
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean
>): JSX.Element {
  return (
    <>
      {$(
        Dict.from_keys(factionIds, (fid) => Factions[fid]),
        ($$) =>
          Vec.map_with_key($$, (fid, { color, name: { short } }) => (
            <InstanceCard key={fid} title="Faction">
              <Chip label={short} color={color} />
            </InstanceCard>
          ))
      )}
    </>
  );
}

const currentMode = (
  { always, never }: Readonly<TemplateConfig>,
  factionId: FactionId
): Mode =>
  always.includes(factionId)
    ? "always"
    : never.includes(factionId)
    ? "never"
    : "random";

function nextMode(
  config: Readonly<TemplateConfig>,
  factionId: FactionId,
  players: Query<readonly PlayerId[]>,
  numFactions: number
): Mode {
  const alwaysEnabled = players.willContainNumElements({
    min: config.always.length + 1,
  });
  const neverEnabled = players.willContainNumElements({
    max: numFactions - config.never.length - 1,
  });

  switch (currentMode(config, factionId)) {
    case "always":
      return neverEnabled ? "never" : "random";
    case "never":
      return "random";
    case "random":
      return alwaysEnabled ? "always" : neverEnabled ? "never" : "random";
  }
}

function switchModes(
  config: Readonly<TemplateConfig>,
  factionId: FactionId,
  currentMode: Mode,
  nextMode: Mode
): Readonly<TemplateConfig> {
  switch (currentMode) {
    case "always":
      switch (nextMode) {
        case "always":
          return config;
        case "never":
          return {
            always: Vec.filter(config.always, (fid) => fid !== factionId),
            never: Vec.sort(Vec.concat(config.never, factionId)),
          };
        case "random":
          return {
            ...config,
            always: Vec.filter(config.always, (fid) => fid !== factionId),
          };
      }
      break;

    case "never":
      switch (nextMode) {
        case "always":
          return {
            always: Vec.sort(Vec.concat(config.always, factionId)),
            never: Vec.filter(config.never, (fid) => fid !== factionId),
          };
        case "never":
          return config;
        case "random":
          return {
            ...config,
            never: Vec.filter(config.never, (fid) => fid !== factionId),
          };
      }
      break;

    case "random":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, factionId)),
          };
        case "never":
          return {
            ...config,
            never: Vec.sort(Vec.concat(config.never, factionId)),
          };
        case "random":
          return config;
      }
  }
}
