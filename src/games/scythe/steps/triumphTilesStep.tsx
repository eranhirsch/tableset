import { Grid, Stack, Typography } from "@mui/material";
import { $, MathUtils, Random, Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { RulesSection } from "games/global/ux/RulesSection";
import { useMemo } from "react";
import triumphTilesVariant from "./triumphTilesVariant";

const TILES = [
  "Upgrades",
  "Mechs",
  "Structures",
  "Recruits",
  "Workers",
  "Objective",
  "Combat",
  "Combat",
  "Combat",
  "Combat",
  "Popularity",
  "Encounters",
  "Factory",
  "Resources",
  "Power",
  "Combat Cards",
] as const;

const NUM_SLOTS = 10;

export default createRandomGameStep({
  id: "triumphTiles",
  labelOverride: "Triumph Tiles: Selection",
  dependencies: [triumphTilesVariant],
  isTemplatable: (isEnabled) => isEnabled.canResolveTo(true)!,
  skip: (_, [isEnabled]) => !isEnabled,

  resolve: (_, isEnabled) =>
    isEnabled
      ? $(
          TILES,
          ($$) =>
            MathUtils.combinations_lazy_array_with_duplicates($$, NUM_SLOTS),
          ($$) => $$.asCanonicalIndex(Random.index($$))
        )
      : null,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Tiles" subheader="Triumph" />
  ),

  ...NoConfigPanel,

  instanceAvroType: "int",
});

function InstanceVariableComponent({
  value: tilesIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const combs = useMemo(
    () =>
      $(
        TILES,
        ($$) =>
          MathUtils.combinations_lazy_array_with_duplicates($$, NUM_SLOTS),
        ($$) => $$.at(tilesIdx),
        $.nullthrows(`Index ${tilesIdx} out of range`),
        ($$) => Vec.sort_by($$, (item) => TILES.indexOf(item))
      ),
    [tilesIdx]
  );

  return (
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">
        Cover the triumph track printed on the board with the following tiles:
      </Typography>
      <Grid container paddingX={4}>
        {Vec.map(Vec.range(0, 4), (index) => (
          <>
            <Grid item xs={6} textAlign="center">
              <Typography variant="body2">
                <strong>{combs[index]}</strong>
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Typography variant="body2">
                <strong>{combs[index + 5]}</strong>
              </Typography>
            </Grid>
          </>
        ))}
      </Grid>
      <IndexHashCaption idx={tilesIdx} />
      <Rules tiles={combs} />
    </Stack>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Randomly select 10 Triumph Tiles and place them on all 10 slots of the
        Triumph Track.
      </Typography>
      <Rules />
    </>
  );
}

function Rules({
  tiles = [],
}: {
  tiles?: readonly typeof TILES[number][];
}): JSX.Element {
  return (
    <RulesSection>
      {/* Copied from the manual verbatim, page 37 */}
      {(tiles.includes("Combat") && tiles.includes("Objective")) || (
        <strong>
          Saxony retains its ability to place any number of stars for{" "}
          <GrammaticalList>
            {Vec.concat(
              !tiles.includes("Combat") ? ["Combat"] : [],
              !tiles.includes("Objective") ? ["Objectives"] : []
            )}
          </GrammaticalList>
          .
        </strong>
      )}
      <>
        There is a Triumph Tile for having 8 Combat Cards in your hand on your
        turn.
      </>
      <>
        There is a Triumph Tile for claiming 3 encounter tokens. Place the star
        after completing the encounter.
      </>
      <>
        There is a Triumph Tile for gaining a Factory card. Place the star when
        you gain the card (at end of turn).
      </>
      <>
        There is a Triumph Tile for controlling 16 total resources (these
        resources can be on various territories you control).
      </>
    </RulesSection>
  );
}