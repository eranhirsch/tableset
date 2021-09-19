import { AvatarGroup, Box, Typography } from "@material-ui/core";
import { useAppSelector } from "../../../app/hooks";
import nullthrows from "../../../common/err/nullthrows";
import PermutationsLazyArray from "../../../common/PermutationsLazyArray";
import { PlayerId } from "../../../core/model/Player";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import Player from "../ux/Player";
import PlayerOrderPanel from "../ux/PlayerOrderPanel";
import PlayOrderFixedTemplateLabel from "../ux/PlayOrderFixedTemplateLabel";

export default createVariableGameStep({
  id: "playOrder",
  labelOverride: "Seating",

  dependencies: [
    // It's meaningless to talk about order with less than 3 players
    createPlayersDependencyMetaStep({ min: 3 }),
  ],

  isType: (x): x is PlayerId[] =>
    Array.isArray(x) && x.every((y) => typeof y === "string"),

  InstanceVariableComponent,
  InstanceManualComponent,

  random(playerIds) {
    const [, ...restOfPlayers] = playerIds;
    const permutations = PermutationsLazyArray.forPermutation(restOfPlayers);
    const selectedIdx = Math.floor(Math.random() * permutations.length);
    return nullthrows(permutations.at(selectedIdx));
  },

  fixed: {
    renderSelector: PlayerOrderPanel,
    renderTemplateLabel: PlayOrderFixedTemplateLabel,

    initializer(playerIds) {
      if (playerIds.length < 3) {
        // Play order is meaningless with 2 players
        return;
      }

      const [, ...restOfPlayers] = playerIds;
      return restOfPlayers;
    },

    refresh(current, playerIds) {
      // Remove any deleted players from the current value.
      let currentRefreshed = current.filter((playerId) =>
        playerIds.includes(playerId)
      );

      const [newPivot, ...rest] = playerIds;

      const newPivotIdx = currentRefreshed.indexOf(newPivot);
      if (newPivotIdx > -1) {
        // the current value can contain the pivot only if the previous pivot
        // was removed so we need to repivot the current array

        currentRefreshed = currentRefreshed
          // First take all players after the new pivot
          .slice(newPivotIdx + 1)
          // Then add the players who were previously before the new pivot
          .concat(currentRefreshed.slice(0, newPivotIdx));
      }

      const missing = rest.filter((playerId) => !current.includes(playerId));
      return currentRefreshed.concat(missing);
    },
  },
});

function InstanceVariableComponent({
  value: playOrder,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);

  return (
    <>
      <Typography variant="body1">
        Sit players clockwise around the table in the following order:
      </Typography>
      <Box display="flex" component="figure">
        <AvatarGroup>
          <Player playerId={firstPlayerId} />
          {playOrder.map((playerId) => (
            <Player playerId={playerId} />
          ))}
        </AvatarGroup>
      </Box>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          Players would play in <strong>clockwise</strong> order around the
          table.
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Choose a seat around the table for each player
          <Footnote index={1} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
