import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, invariant, Vec } from "common";
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
import { MatId, PlayerMats } from "../utils/PlayerMats";
import productsMetaStep from "./productsMetaStep";

type TemplateConfig = {
  always: readonly MatId[];
  never: readonly MatId[];
};

type Mode = "always" | "never" | "random";

export default createRandomGameStep({
  id: "playerMats",
  dependencies: [playersMetaStep, productsMetaStep],

  isType: (x: unknown): x is readonly MatId[] =>
    Array.isArray(x) && x.every((mid) => PlayerMats[mid as MatId] != null),

  isTemplatable: () => true,

  initialConfig: (): Readonly<TemplateConfig> => ({ always: [], never: [] }),

  resolve(config, players, products) {
    const available = PlayerMats.availableForProducts(products!);

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

  refresh({ always, never }, players, products) {
    const available = PlayerMats.availableForProducts(
      products.onlyResolvableValue()!
    );

    if (!Vec.is_empty(Vec.diff(always, available))) {
      // If always has values which are now unavailable, we can't fix the config
      // because we don't know how to fill the gap created by the missing
      // mat trivially (do we just remove it? do we replace it? etc...)
      templateValue("unfixable");
    }

    if (!players.willContainNumElements({ min: always.length })) {
      // There are more values in the always array then there are players, we
      // can't use the array and there's no trivial way to fix it either (what
      // mat do you remove?)
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
    () =>
      Vec.sort_by(
        PlayerMats.availableForProducts(products.onlyResolvableValue()!),
        (matId) => PlayerMats[matId].rank
      ),
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
      {Vec.map(available, (matId) => (
        <MatChip
          key={matId}
          matId={matId}
          mode={currentMode(config, matId)}
          onClick={() =>
            onChange((current) =>
              switchModes(
                current,
                matId,
                currentMode(current, matId),
                nextMode(current, matId, players, available.length)
              )
            )
          }
        />
      ))}
    </Box>
  );
}

function MatChip({
  matId,
  mode,
  onClick,
}: {
  matId: MatId;
  mode: "always" | "never" | "random";
  onClick(): void;
}): JSX.Element {
  const { name } = PlayerMats[matId];
  return (
    <Chip
      sx={{
        opacity: mode === "never" ? 0.75 : 1.0,
        paddingX:
          mode === "random" ? "12px" : mode === "always" ? undefined : "3px",
      }}
      icon={
        mode === "always" ? (
          <CheckCircleIcon fontSize="small" />
        ) : mode === "never" ? (
          <NotInterestedRoundedIcon fontSize="small" />
        ) : undefined
      }
      variant={mode === "never" ? "outlined" : "filled"}
      color={mode === "always" ? "primary" : undefined}
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
          Dict.select_keys(PlayerMats, always),
          (mid, { name }) => <React.Fragment key={mid}>{name}</React.Fragment>
        ),
        unassignedCount > 0
          ? [
              <>
                {unassignedCount} random mat
                {unassignedCount > 1 && "s"}
                {!Vec.is_empty(never) && (
                  <>
                    {" "}
                    (but not{" "}
                    <GrammaticalList finalConjunction="or">
                      {React.Children.toArray(
                        Vec.map(never, (mid) => PlayerMats[mid].name)
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
  value: matIds,
}: VariableStepInstanceComponentProps<readonly MatId[]>): JSX.Element {
  return (
    <>
      <Typography variant="body1">The mats are:</Typography>
      <Stack
        spacing={1}
        direction="column"
        textAlign="center"
        paddingX={8}
        paddingY={2}
      >
        {Vec.map_with_key(
          Dict.select_keys(PlayerMats, matIds),
          (matId, { name }) => (
            <strong key={matId}>{name}</strong>
          )
        )}
      </Stack>
    </>
  );
}

const currentMode = (
  { always, never }: Readonly<TemplateConfig>,
  matId: MatId
): Mode =>
  always.includes(matId)
    ? "always"
    : never.includes(matId)
    ? "never"
    : "random";

function nextMode(
  config: Readonly<TemplateConfig>,
  matId: MatId,
  players: Query<readonly PlayerId[]>,
  numMats: number
): Mode {
  const alwaysEnabled = players.willContainNumElements({
    min: config.always.length + 1,
  });
  const neverEnabled = players.willContainNumElements({
    max: numMats - config.never.length - 1,
  });

  switch (currentMode(config, matId)) {
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
  matId: MatId,
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
            always: Vec.filter(config.always, (mid) => mid !== matId),
            never: Vec.sort(Vec.concat(config.never, matId)),
          };
        case "random":
          return {
            ...config,
            always: Vec.filter(config.always, (mid) => mid !== matId),
          };
      }
      break;

    case "never":
      switch (nextMode) {
        case "always":
          return {
            always: Vec.sort(Vec.concat(config.always, matId)),
            never: Vec.filter(config.never, (mid) => mid !== matId),
          };
        case "never":
          return config;
        case "random":
          return {
            ...config,
            never: Vec.filter(config.never, (mid) => mid !== matId),
          };
      }
      break;

    case "random":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, matId)),
          };
        case "never":
          return {
            ...config,
            never: Vec.sort(Vec.concat(config.never, matId)),
          };
        case "random":
          return config;
      }
  }
}
