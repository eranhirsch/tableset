import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, Vec } from "common";
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
import { GamePiecesColor } from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import productsMetaStep from "./productsMetaStep";

type FactionId =
  /* spell-checker: disable */
  | "albion"
  | "crimea"
  | "fenris"
  | "nordic"
  | "polania"
  | "rusviet"
  | "saxony"
  | "tesla"
  | "togawa";
/* spell-checker: enable */

interface Faction {
  name: string;
  color: GamePiecesColor;
}
const FACTIONS: Readonly<Record<FactionId, Readonly<Faction>>> = {
  /* spell-checker: disable */
  albion: { name: "Clan Albion", color: "green" },
  crimea: { name: "Crimean Khanate", color: "yellow" },
  fenris: { name: "Fenris", color: "orange" },
  nordic: { name: "Nordic Kingdoms", color: "blue" },
  polania: { name: "Republic of Polania", color: "white" },
  rusviet: { name: "Rusviet Union", color: "red" },
  saxony: { name: "Saxony Empire", color: "black" },
  tesla: { name: "Tesla", color: "cyan" },
  togawa: { name: "Togawa Shogunate", color: "purple" },
  /* spell-checker: enable */
};

const FACTIONS_IN_PRODUCTS: Readonly<
  Partial<Record<ScytheProductId, readonly FactionId[]>>
> = {
  /* spell-checker: disable */
  base: ["saxony", "rusviet", "crimea", "polania", "nordic"],
  invaders: ["albion", "togawa"],
  fenris: ["tesla", "fenris"],
  /* spell-checker: enable */
};

type TemplateConfig = {
  always: readonly FactionId[];
  never: readonly FactionId[];
};

type Mode = "always" | "never" | "random";

export default createRandomGameStep({
  id: "faction",
  dependencies: [playersMetaStep, productsMetaStep],
  isTemplatable: () => true,
  initialConfig: (): Readonly<TemplateConfig> => ({ always: [], never: [] }),
  resolve: (config, players, products) =>
    Vec.sort(
      Vec.concat(
        config.always,
        Vec.sample(
          Vec.diff(
            Vec.diff(availableFactions(products!), config.never),
            config.always
          ),
          players!.length - config.always.length
        )
      )
    ),
  refresh({ always, never }, players, products) {
    const available = availableFactions(products.onlyResolvableValue()!);

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
    () => Vec.sort(availableFactions(products.onlyResolvableValue()!)),
    [products]
  );
  return (
    <Box
      padding={3}
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
  const { name, color } = FACTIONS[factionId];
  return (
    <Chip
      sx={{
        opacity: mode === "never" ? 0.75 : 1.0,
        paddingX:
          mode === "random" ? "13px" : mode === "always" ? undefined : "3px",
      }}
      icon={
        mode === "always" ? (
          <CheckCircleIcon fontSize="small" />
        ) : mode === "never" ? (
          <NotInterestedRoundedIcon fontSize="small" />
        ) : undefined
      }
      variant={mode === "never" ? "outlined" : "filled"}
      color={color}
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
          Dict.select_keys(FACTIONS, always),
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
                        Vec.map(never, (fid) => FACTIONS[fid].name)
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
    <>
      <Typography variant="body1">The factions are:</Typography>
      <Stack
        spacing={1}
        direction="column"
        textAlign="center"
        paddingX={8}
        paddingY={2}
      >
        {Vec.map_with_key(
          Dict.select_keys(FACTIONS, factionIds),
          (factionId, { name, color }) => (
            <Chip
              key={factionId}
              color={color}
              label={<strong>{name}</strong>}
            />
          )
        )}
      </Stack>
    </>
  );
}

const availableFactions = (
  products: readonly ScytheProductId[]
): readonly FactionId[] =>
  Vec.flatten(Vec.values(Dict.select_keys(FACTIONS_IN_PRODUCTS, products)));

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
  const availableModes = Vec.filter_nulls([
    players.willContainNumElements({ min: config.always.length + 1 })
      ? ("always" as Mode)
      : null,
    players.willContainNumElements({
      max: numFactions - config.never.length - 1,
    })
      ? ("never" as Mode)
      : null,
    "random" as Mode,
  ]);
  return availableModes[
    (availableModes.indexOf(currentMode(config, factionId)) + 1) %
      availableModes.length
  ];
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
