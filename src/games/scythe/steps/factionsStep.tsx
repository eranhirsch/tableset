import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { invariant, Shape, Vec } from "common";
import { playersSelectors } from "features/players/playersSlice";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
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
    const random = Vec.sample(randomPool, randomCount);
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
});

function ConfigPanel({
  config,
  queries: [players, products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[]
>): JSX.Element {
  const available = useMemo(
    () =>
      Vec.sort(Factions.availableForProducts(products.onlyResolvableValue()!)),
    [products]
  );
  return (
    <Box
      paddingX={4}
      paddingY={2}
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      gap={1}
    >
      {Vec.map(available, (factionId) => (
        <FactionChip
          key={factionId}
          factionId={factionId}
          mode={currentMode(config, factionId)}
          onClick={() =>
            onChange((current) =>
              switchModes(
                current,
                factionId,
                currentMode(current, factionId),
                nextMode(current, factionId, players, available.length)
              )
            )
          }
        />
      ))}
    </Box>
  );
}

function FactionChip({
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
        paddingX:
          mode === "random" ? "12px" : mode === "always" ? undefined : "3px",
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
          (fid, { name, color }) => (
            <Chip
              key={fid}
              component="span"
              color={color}
              size="small"
              label={name}
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
                        Vec.map(never, (fid) => Factions[fid].name)
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
