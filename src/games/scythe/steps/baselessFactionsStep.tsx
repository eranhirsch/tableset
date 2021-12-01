import { Chip, Stack, Typography } from "@mui/material";
import { $, Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";

const [BASED_FACTION_IDS, BASELESS_FACTION_IDS] = Vec.partition(
  Factions.ALL_IDS,
  // Only "based" factions have a based order on the regular map
  (fid) => Factions[fid].order != null
);

export default createRandomGameStep({
  id: "baselessFactions",
  dependencies: [productsMetaStep, modularBoardVariant, factionsStep],
  isTemplatable: (products, isModular, factions) =>
    isModular.canResolveTo(false)! &&
    products.willContain("fenris")! &&
    BASELESS_FACTION_IDS.some((fid) => factions.willContain(fid) !== false),

  resolve(_config, _products, isModular, factionIds) {
    if (isModular) {
      return null;
    }

    const [basedFactionIds, baselessFactionIds] = Vec.partition(
      factionIds!,
      (fid) => BASED_FACTION_IDS.includes(fid)
    );
    if (Vec.is_empty(baselessFactionIds)) {
      return null;
    }

    const remainingHomeBases = Vec.diff(BASED_FACTION_IDS, basedFactionIds);
    return Random.shuffle(
      Random.sample(remainingHomeBases, baselessFactionIds.length)
    );
  },

  ...NoConfigPanel,

  InstanceVariableComponent,
  InstanceCards,

  instanceAvroType: {
    type: "array",
    items: {
      type: "enum",
      name: "BaseId",
      symbols: [...Factions.ALL_IDS],
    },
  },
});

function InstanceVariableComponent({
  value,
}: VariableStepInstanceComponentProps<readonly FactionId[]>): JSX.Element {
  const factionIds = useRequiredInstanceValue(factionsStep);

  const bases = useMemo(
    () =>
      $(
        factionIds,
        ($$) => Vec.intersect($$, BASELESS_FACTION_IDS),
        Vec.sort,
        ($$) => Vec.zip($$, value)
      ),
    [factionIds, value]
  );

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">
        Place the home base tiles on top of the printed home bases on the board:
      </Typography>
      {React.Children.toArray(
        Vec.map(bases, ([baselessFid, homeBaseFid]) => (
          <span>
            <Chip
              component="span"
              color={Factions[baselessFid].color}
              label={Factions[baselessFid].name.full}
            />{" "}
            on top of{" "}
            <Chip
              component="span"
              color={Factions[homeBaseFid].color}
              label={Factions[homeBaseFid].name.short}
            />
          </span>
        ))
      )}
    </Stack>
  );
}

function InstanceCards({
  value,
  dependencies: [_products, _isModular, factionIds],
  onClick,
}: InstanceCardsProps<
  readonly FactionId[],
  readonly ScytheProductId[],
  boolean,
  readonly FactionId[]
>): JSX.Element {
  const bases = useMemo(
    () =>
      $(
        factionIds!,
        ($$) => Vec.intersect($$, BASELESS_FACTION_IDS),
        Vec.sort,
        ($$) => Vec.zip($$, value)
      ),
    [factionIds, value]
  );

  return (
    <>
      {Vec.map(bases, ([baselessFid, homeBaseFid]) => (
        <InstanceCard
          key={`baseless_${baselessFid}`}
          title="Base"
          subheader={Factions[baselessFid].name.short}
          onClick={onClick}
        >
          <Chip
            color={Factions[homeBaseFid].color}
            label={Factions[homeBaseFid].name.short}
          />
        </InstanceCard>
      ))}
    </>
  );
}
