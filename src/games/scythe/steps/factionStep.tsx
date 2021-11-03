import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import PushPinIcon from "@mui/icons-material/PushPin";
import { Box, Chip, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, Vec } from "common";
import { playersSelectors } from "features/players/playersSlice";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
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
  config: { always, never },
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
      // alignContent="space-around"
      gap={1}
    >
      {Vec.map(available, (factionId) => (
        <FactionChip
          key={factionId}
          factionId={factionId}
          mode={
            always.includes(factionId)
              ? "always"
              : never.includes(factionId)
              ? "never"
              : "random"
          }
          onClick={() =>
            // TODO prevent pinning more items than number of players:
            // players.willContainNumElements({
            //   min: always.length + 1,
            // })
            onChange((current) =>
              current.always.includes(factionId)
                ? {
                    ...current,
                    always: Vec.filter(
                      current.always,
                      (fid) => fid !== factionId
                    ),
                  }
                : current.never.includes(factionId)
                ? {
                    always: Vec.sort(Vec.concat(current.always, factionId)),
                    never: Vec.filter(
                      current.never,
                      (fid) => fid !== factionId
                    ),
                  }
                : {
                    ...current,
                    never: Vec.sort(Vec.concat(current.never, factionId)),
                  }
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
      sx={{ opacity: mode === "never" ? 0.5 : 1.0 }}
      icon={
        mode === "always" ? (
          <PushPinIcon fontSize="small" />
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
                .
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
    <Typography variant="body1">
      The chosen factions are{" "}
      <GrammaticalList>
        {Vec.map_with_key(
          Dict.select_keys(FACTIONS, factionIds),
          (factionId, { name, color }) => (
            <Chip
              key={factionId}
              component="span"
              size="small"
              color={color}
              label={<strong>{name}</strong>}
            />
          )
        )}
      </GrammaticalList>
    </Typography>
  );
}

const availableFactions = (
  products: readonly ScytheProductId[]
): readonly FactionId[] =>
  Vec.flatten(Vec.values(Dict.select_keys(FACTIONS_IN_PRODUCTS, products)));
