import { Box, Typography } from "@material-ui/core";
import createComputedGameStep from "../../core/steps/createComputedGameStep";

export const MARKET_DECK_I = [
  "Architect",
  "Prefect",
  "Mercator",
  "Colonist",
  "Diplomat",
  "Mason",
  "Farmer",
  "Smith",
] as const;

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

function range(a: number, b: number): number[] {
  const res: number[] = [];
  for (let i = a; i < b; i++) {
    res.push(i);
  }
  return res;
}

function grammaticalList(terms: readonly string[]): string {
  if (terms.length === 1) {
    return terms[0];
  }

  if (terms.length === 2) {
    return terms.join(" and ");
  }

  return `${terms.slice(0, terms.length - 1).join(", ")}, and ${
    terms[terms.length - 1]
  }`;
}

function MarketCards({ playerCount }: { playerCount: number }) {
  const inUse = range(1, playerCount + 1).map(
    (i) => `${ROMAN_NUMERALS[i]} (${CARDS_PER_DECK[i]} cards)`
  );
  const leaveInBox = range(playerCount + 1, CARDS_PER_DECK.length).map(
    (x) => ROMAN_NUMERALS[x]!
  );

  return (
    <Box>
      <Typography variant="body1">
        Take all cards with numerals {grammaticalList(inUse)} and create a
        seperate deck for each numeral.
      </Typography>
      {leaveInBox.length > 0 && (
        <Typography variant="caption">
          Leave cards with numeral{leaveInBox.length > 1 ? "s" : ""}{" "}
          {grammaticalList(leaveInBox)} in the box (they won't be needed)
        </Typography>
      )}
    </Box>
  );
}

export default createComputedGameStep({
  id: "marketCards",

  renderComputed: ({ playerIds }) => {
    if (playerIds.length < 1) {
      // There's really nothing meaningful to do
      return;
    }

    if (playerIds.length > 5) {
      // Not enough decks
      return;
    }

    return <MarketCards playerCount={playerIds.length} />;
  },
});
