import { Chip, Stack, Typography } from "@mui/material";
import { $, C, Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { FactionChip } from "../ux/FactionChip";
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

  skip(_value, [productIds, isModular, factionIds]) {
    if (isModular) {
      // This step isn't relevant for the modular board
      return true;
    }

    const baseless = Vec.intersect(
      Factions.availableForProducts(productIds!),
      BASELESS_FACTION_IDS
    );

    if (Vec.is_empty(baseless)) {
      // No baseless factions in the set of products
      return true;
    }

    if (factionIds == null) {
      // We don't know what factions are in play, we need to show this step
      return false;
    }

    // None of the baseless factions are in the game
    return Vec.is_disjoint(baseless, factionIds);
  },

  ...NoConfigPanel,

  InstanceVariableComponent,
  InstanceManualComponent,
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

function InstanceManualComponent(): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const factionIds = useOptionalInstanceValue(factionsStep);

  const allBaselessFactionIds = useMemo(
    () =>
      Vec.intersect(
        BASELESS_FACTION_IDS,
        Factions.availableForProducts(productIds)
      ),
    [productIds]
  );

  if (factionIds == null) {
    return (
      <HeaderAndSteps
        synopsis={
          <>
            <em>
              If playing with the any of the <em>baseless factions</em>:{" "}
              <GrammaticalList finalConjunction="or">
                {Vec.map(allBaselessFactionIds, (fid) => (
                  <FactionChip factionId={fid} />
                ))}
              </GrammaticalList>
            </em>
            : assign a home base for them:
          </>
        }
      >
        <BlockWithFootnotes
          footnotes={[
            <>
              These are:{" "}
              <GrammaticalList>
                {Vec.map(BASED_FACTION_IDS, (fid) => (
                  <FactionChip factionId={fid} />
                ))}
              </GrammaticalList>
              .
            </>,
            <>
              As selected in <InstanceStepLink step={factionsStep} />
            </>,
          ]}
        >
          {(Footnote) => (
            <>
              Gather all faction boards with home bases on the board
              <Footnote index={1} /> which aren't used in this game
              <Footnote index={2} />.
            </>
          )}
        </BlockWithFootnotes>

        <>Shuffle them.</>
        <>
          Randomly draw one faction mat for each <em>baseless</em> faction{" "}
          <strong>in play</strong>.
        </>
        <>
          Put the home-base tile for that faction on top of the home-base of the
          selected faction on the board.
        </>
      </HeaderAndSteps>
    );
  }

  const baselessInPlay = Vec.intersect(BASELESS_FACTION_IDS, factionIds);

  return (
    <HeaderAndSteps
      synopsis={
        <>
          Assign a home base for{" "}
          <GrammaticalList>
            {Vec.map(baselessInPlay, (fid) => (
              <FactionChip factionId={fid} />
            ))}
          </GrammaticalList>
          :
        </>
      }
    >
      <>
        Gather the faction boards for{" "}
        <GrammaticalList>
          {$(
            Factions.availableForProducts(productIds),
            ($$) => Vec.intersect($$, BASED_FACTION_IDS),
            ($$) => Vec.diff($$, factionIds),
            ($$) => Vec.map($$, (fid) => <FactionChip factionId={fid} />)
          )}
        </GrammaticalList>
        .
      </>
      <>Shuffle them.</>
      {baselessInPlay.length === 1 ? (
        <>Randomly draw a faction mat.</>
      ) : (
        <>
          Randomly draw{" "}
          <GrammaticalList>
            {Vec.map(baselessInPlay, (fid) => (
              <>
                one faction mat for <FactionChip factionId={fid} />
              </>
            ))}
          </GrammaticalList>
          .
        </>
      )}
      {baselessInPlay.length === 1 ? (
        <>
          Put <FactionChip factionId={C.onlyx(baselessInPlay)} />
          's home-base tile on the board on top of the home-base of the drawn
          faction.
        </>
      ) : (
        <>
          Put{" "}
          <GrammaticalList>
            {Vec.map(baselessInPlay, (fid) => (
              <>
                <FactionChip factionId={fid} />
                's
              </>
            ))}
          </GrammaticalList>{" "}
          home-base tiles on the board on top of the home-bases of the matching
          drawn factions.
        </>
      )}
    </HeaderAndSteps>
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
