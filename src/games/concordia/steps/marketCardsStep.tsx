import { Box, Typography } from "@material-ui/core";
import grammatical_list from "../../../common/lib_utils/grammatical_list";
import range from "../../../common/lib_utils/range";
import { PlayerId } from "../../../features/players/playersSlice";
import createDerivedGameStep, {
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import createPlayersDependencyMetaStep from "../../core/steps/createPlayersDependencyMetaStep";
import { MARKET_DECK_I } from "../utils/MarketDisplayEncoder";

const CARDS_PER_DECK = [
  // the array is 0-indexed
  undefined,
  // I: ...
  MARKET_DECK_I.length,
  // II: Architect, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
  7,
  // III: Arhcitect, Prefect, Mercator, Colonist, Diplomat, Consul
  6,
  // IV: Architect, Prefect, Colonist, Diplomat, Consul
  5,
  // V: Prefect, Mercator, Diplomat, Consul
  4,
] as const;

const ROMAN_NUMERALS = [undefined, "I", "II", "III", "IV", "V"];

export default createDerivedGameStep({
  id: "marketCards",
  dependencies: [createPlayersDependencyMetaStep({ max: 5 })],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element | null {
  if (playerIds == null) {
    // No players, we can derive how many decks to use
    return <div>No Players!</div>;
  }

  const playerCount = playerIds.length;

  if (playerCount < 1) {
    // There's really nothing meaningful to do
    return null;
  }

  if (playerCount > 5) {
    // Not enough decks
    return null;
  }

  const inUse = range(1, playerCount + 1).map(
    (i) => `${ROMAN_NUMERALS[i]} (${CARDS_PER_DECK[i]} cards)`
  );
  const leaveInBox = range(playerCount + 1, CARDS_PER_DECK.length).map(
    (x) => ROMAN_NUMERALS[x]!
  );

  return (
    <Box>
      <Typography variant="body1">
        Take all cards with numerals {grammatical_list(inUse)} and create a
        seperate deck for each numeral.
      </Typography>
      {leaveInBox.length > 0 && (
        <Typography variant="caption">
          Leave cards with numeral{leaveInBox.length > 1 ? "s" : ""}{" "}
          {grammatical_list(leaveInBox)} in the box (they won't be needed)
        </Typography>
      )}
    </Box>
  );
}
