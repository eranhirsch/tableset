import { Grid, Typography } from "@mui/material";
import { $, MathUtils, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { Characters } from "../utils/Characters";
import { CharacterChip } from "../ux/CharacterChip";
import { OTHER_CARDS } from "./locationsStep";

export default createRandomGameStep({
  id: "startLocations",

  dependencies: [playersMetaStep],

  isTemplatable: () => true,

  resolve: (_, playerIds) =>
    $(
      playerIds!.length,
      Characters.forPlayerCount,
      MathUtils.permutations_lazy_array,
      ($$) => Random.index($$)
    ),

  InstanceVariableComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Locations" />
  ),

  instanceAvroType: "int",

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: permIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);

  const order = useMemo(
    () =>
      $(
        playerIds.length,
        Characters.forPlayerCount,
        MathUtils.permutations_lazy_array,
        ($$) => $$.at(permIdx),
        $.nullthrows(`Index ${permIdx} is out of range!`)
      ),
    [permIdx, playerIds.length]
  );

  return (
    <>
      <Typography variant="body1">
        Place the character tokens in the following locations:
      </Typography>
      <Grid container rowSpacing={1} marginTop={1}>
        <Grid item xs={3}>
          Prepare:
        </Grid>
        <Grid item xs={9}>
          <GrammaticalList>
            {Vec.filter_nulls([
              <CharacterChip
                characterId={order[0]}
                small={playerIds.length >= 5}
              />,
              playerIds.length >= 5 ? (
                <CharacterChip
                  characterId={order[4]}
                  small={playerIds.length >= 5}
                />
              ) : null,
            ])}
          </GrammaticalList>
          .
        </Grid>
        <Grid item xs={3}>
          {OTHER_CARDS[0]}:
        </Grid>
        <Grid item xs={9}>
          <GrammaticalList>
            {Vec.filter_nulls([
              <CharacterChip
                characterId={order[1]}
                small={playerIds.length >= 5}
              />,
              playerIds.length >= 5 ? (
                <CharacterChip
                  characterId={order[5]}
                  small={playerIds.length >= 5}
                />
              ) : null,
            ])}
          </GrammaticalList>
          .
        </Grid>
        <Grid item xs={3}>
          {OTHER_CARDS[1]}:
        </Grid>
        <Grid item xs={9}>
          <CharacterChip characterId={order[2]} small={playerIds.length >= 5} />
          .
        </Grid>
        <Grid item xs={3}>
          {OTHER_CARDS[2]}:
        </Grid>
        <Grid item xs={9}>
          {playerIds.length >= 4 ? (
            <CharacterChip
              characterId={order[3]}
              small={playerIds.length >= 5}
            />
          ) : (
            <em>(None).</em>
          )}
        </Grid>
      </Grid>
      <IndexHashCaption idx={permIdx} />
    </>
  );
}
