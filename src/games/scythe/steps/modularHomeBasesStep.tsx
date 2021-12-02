import { Chip, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { hasProductSelector } from "features/collection/collectionSlice";
import { gameSelector } from "features/game/gameSlice";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { isIndexType } from "games/global/coercers/isIndexType";
import {
  AlwaysNeverMultiChipSelector,
  AlwaysNeverMultiLabel,
} from "games/global/ux/AlwaysNeverMultiChipSelector";
import { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { Factions } from "../utils/Factions";
import { HomeBaseId, HomeBases } from "../utils/HomeBases";
import modularBoardVariant from "./modularBoardVariant";
import productsMetaStep from "./productsMetaStep";

const NUM_BASES = 8;

interface TemplateConfig {
  always: readonly HomeBaseId[];
  never: readonly HomeBaseId[];
}

export default createRandomGameStep({
  id: "homeBases",

  labelOverride: "Modular: Home Bases",

  isType: isIndexType,

  dependencies: [productsMetaStep, modularBoardVariant],

  isTemplatable: (_products, modular) => modular.canResolveTo(true),

  initialConfig: (products): Readonly<TemplateConfig> => ({
    always: [],
    never: products.willContain("fenris") ? ["empty"] : [],
  }),

  resolve: ({ always, never }, productIds, isModular) =>
    isModular ? HomeBases.randomIdx(always, never, productIds!) : null,

  refresh({ always, never }, products, _isModular) {
    const available = Factions.availableForProducts(
      products.onlyResolvableValue()!
    );
    if (!Vec.is_contained_in(always, available)) {
      // The always array contains factions that aren't available anymore
      templateValue("unfixable");
    }

    if (Vec.is_contained_in(never, available)) {
      templateValue(
        available.length - never.length < HomeBases.COUNT
          ? // We won't have enough factions to fill all the bases
            "unfixable"
          : // The current config doesn't have any unsupported values
            "unchanged"
      );
    }

    const newNever = Vec.intersect(never, available);
    if (available.length - newNever.length < HomeBases.COUNT) {
      // We won't have enough factions to fill all the bases
      templateValue("unfixable");
    }

    // We need to remove unsupported factions from the never array
    return { always, never: newNever };
  },

  skip: (_, [_products, isModular]) => !isModular,

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard title="Bases" subheader="Modular" {...props} />
  ),

  instanceAvroType: "int",
});

function ConfigPanel({
  config,
  queries: [products, _isModular],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly ScytheProductId[],
  boolean
>): JSX.Element {
  if (!products.willContain("fenris")) {
    return <NoConfigPanel.ConfigPanel />;
  }

  return (
    <AlwaysNeverMultiChipSelector
      itemIds={HomeBases.ALL_IDS}
      getLabel={(fid) => (fid === "empty" ? "Empty" : Factions[fid].name.short)}
      getColor={(fid) => (fid === "empty" ? "brown" : Factions[fid].color)}
      limits={{ min: NUM_BASES, max: NUM_BASES }}
      value={config}
      onChange={onChange}
    />
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  const game = useAppSelector(gameSelector);
  const hasFenris = useAppSelector(hasProductSelector(game, "fenris"));

  if (!hasFenris) {
    return <>Random</>;
  }

  return (
    <AlwaysNeverMultiLabel
      value={config}
      getLabel={(fid) => (fid === "empty" ? "Empty" : Factions[fid].name.short)}
      getColor={(fid) => (fid === "empty" ? "brown" : Factions[fid].color)}
      limits={{ min: NUM_BASES, max: NUM_BASES }}
    />
  );
}

function InstanceVariableComponent({
  value: basesIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const perm = useMemo(() => HomeBases.decode(basesIdx), [basesIdx]);

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">
        Layout the home bases in the following order:
      </Typography>
      <Grid container spacing={1} maxWidth="100%" paddingRight={1}>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[7]} />
        </Grid>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[0]} />
        </Grid>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[1]} />
        </Grid>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[6]} />
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[2]} />
        </Grid>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[5]} />
        </Grid>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[4]} />
        </Grid>
        <Grid item xs={4}>
          <HomeBaseChip homeBaseId={perm[3]} />
        </Grid>
      </Grid>
      <IndexHashCaption idx={basesIdx} />
    </Stack>
  );
}

function HomeBaseChip({ homeBaseId }: { homeBaseId: HomeBaseId }): JSX.Element {
  return homeBaseId === "empty" ? (
    <Chip variant="outlined" label="Empty" sx={{ width: "100%" }} />
  ) : (
    <Chip
      sx={{ width: "100%" }}
      color={Factions[homeBaseId].color}
      label={Factions[homeBaseId].name.short}
    />
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Assign a home base for each faction:">
      <BlockWithFootnotes
        footnote={
          <>
            Cardboard discs with faction logos on one side and a tent on the the
            other side. One of the discs depicts a tent on the other side too,
            this is for the empty home base.
          </>
        }
      >
        {(Footnote) => (
          <>
            Flip all home-base tiles
            <Footnote /> so their faction side is hidden.
          </>
        )}
      </BlockWithFootnotes>
      <>Shuffle the tiles.</>
      <BlockWithFootnotes
        footnote={
          <>A encircled tent, inside a hex, on the perimeter of the map.</>
        }
      >
        {(Footnote) => (
          <>
            Randomly put a tile on each home-base space on the board
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Flip the tiles so that their faction side is showing;{" "}
        <em>
          one tile would show a tent, this is an empty home-base that isn't used
          by any faction
        </em>
        .
      </>
    </HeaderAndSteps>
  );
}
