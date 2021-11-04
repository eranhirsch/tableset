import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, invariant, Random, Shape, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
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
import { MatId, PlayerMats } from "../utils/PlayerMats";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

type TemplateConfig = {
  always: readonly FactionId[];
  never: readonly FactionId[];
};

type Mode = "always" | "never" | "random";

// TODO: Make this part of the config
const BANNED_COMBOS: Readonly<Partial<Record<MatId, readonly FactionId[]>>> = {
  industrial: ["rusviet"],
  patriotic: ["crimea"],
};

export default createRandomGameStep({
  id: "factions",
  dependencies: [playersMetaStep, productsMetaStep, playerMatsStep],

  isTemplatable: () => true,

  initialConfig: (): Readonly<TemplateConfig> => ({ always: [], never: [] }),

  resolve(config, players, products, playerMatsIdx) {
    const available = Factions.availableForProducts(products!);

    const playerMats =
      playerMatsIdx != null
        ? PlayerMats.decode(playerMatsIdx, players!.length, products!)
        : null;

    // Random factions are those that aren't required by `always` and aren't
    // disallowed by `never`
    const randomFactions = Vec.diff(
      Vec.diff(available, config.never),
      config.always
    );
    // Candidates are all required factions (put first so they get priority) and
    // a random order for the random factions (so that all factions have the
    // same probability of being chosen)
    const candidates = Vec.concat(
      config.always,
      Random.shuffle(randomFactions)
    );

    const factionIds = Vec.range(0, players!.length - 1).reduce(
      (ongoing, index) =>
        randomFactionsReducer(
          ongoing,
          playerMats != null ? playerMats[index] : null,
          players!.length,
          candidates
        ),
      [] as readonly FactionId[]
    );

    invariant(
      factionIds.length === players!.length,
      `Mismatch in number of factions chosen: ${JSON.stringify(
        factionIds
      )}, expected: ${players!.length}`
    );

    debugger;

    return Factions.encode(factionIds, products!);
  },

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

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
});

function randomFactionsReducer(
  ongoing: readonly FactionId[],
  matId: MatId | null,
  playersCount: number,
  candidates: readonly FactionId[]
): readonly FactionId[] {
  return Vec.concat(
    ongoing,
    // Sample 1 random element from the array of candidate factions
    Vec.sample(
      // We build the array of possible factions so that the first factions
      // in it are the required ones, and the rest are the candidate
      // factions, re-ordered randomly. We then take the first elements of
      // this array depending on how many factions we already have chosen
      // and how many players. This makes sure we always include all
      // `always` factions, and that the remaining factions are taken
      // randomly.
      Vec.take(
        Vec.diff(
          Vec.diff(
            candidates,
            // Remove any factions already selected
            ongoing
          ),
          // We might not have mats data (that step might be turned off in the
          // template)
          // Remove banned factions (if any)
          matId != null ? BANNED_COMBOS[matId] ?? [] : []
        ),
        // Take just enough elements so that we always include `always` factions
        playersCount - ongoing.length
      ),
      1
    )
  );
}

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
  const { name, color } = Factions[factionId];
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
  value: factionIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const matsIdx = useOptionalInstanceValue(playerMatsStep);
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const products = useRequiredInstanceValue(productsMetaStep);

  const playerMatIds = useMemo(
    () =>
      matsIdx == null
        ? null
        : PlayerMats.decode(matsIdx, playerIds.length, products),
    [matsIdx, playerIds.length, products]
  );

  const factionIds = useMemo(
    () => Factions.decode(factionIdx, playerIds.length, products),
    [factionIdx, playerIds.length, products]
  );

  debugger;

  return (
    <>
      <Typography variant="body1">
        The factions {playerMatIds != null && "and matching player mats "}are:
      </Typography>
      <Stack
        spacing={1}
        direction="column"
        textAlign="center"
        paddingX={8}
        paddingY={2}
      >
        {React.Children.toArray(
          Vec.map_with_key(
            // Don't use Dict.select_keys here because that uses the order from
            // the source dict, not the keys array
            Dict.from_keys(factionIds, (factionId) => Factions[factionId]),
            (_, { name, color }, index) => (
              <Chip
                color={color}
                label={
                  <>
                    {playerMatIds != null &&
                      `${PlayerMats[playerMatIds[index]].name} `}
                    <strong>{name}</strong>
                  </>
                }
              />
            )
          )
        )}
      </Stack>
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
  numMats: number
): Mode {
  const alwaysEnabled = players.willContainNumElements({
    min: config.always.length + 1,
  });
  const neverEnabled = players.willContainNumElements({
    max: numMats - config.never.length - 1,
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
