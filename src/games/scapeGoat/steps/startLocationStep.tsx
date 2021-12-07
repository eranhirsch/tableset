import { Grid, Typography } from "@mui/material";
import { $, MathUtils, Random, Vec } from "common";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
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
  InstanceManualComponent,
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

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);

  return (
    <HeaderAndSteps synopsis="Put characters in starting locations:">
      <>Gather the player tokens that match the colors of the player mats.</>
      <>Flip all tokens to their back side.</>
      <>Shuffle them.</>
      <>
        Starting with the <em>Prepare</em> location card and going from left to
        right, put one character token on each location
        {playerIds.length > 4 && (
          <>
            . Skip the <em>Go to the Cops</em> location and continue putting
            tokens from the <em>Prepare</em> location again
          </>
        )}
        .
      </>
      <>
        Flip all tokens to show the character;{" "}
        <em>
          Take note of which character was put first on the Prepare location
        </em>
        .
      </>
    </HeaderAndSteps>
  );
}