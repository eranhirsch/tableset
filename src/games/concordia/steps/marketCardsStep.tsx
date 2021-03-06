import { invariant, Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import { playersMetaStep } from "games/global";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "../../core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { GrammaticalList } from "../../core/ux/GrammaticalList";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MARKET_DECK_I } from "../utils/MarketDisplayEncoder";
import { ROMAN_NUMERALS } from "../utils/ROMAN_NUMERALS";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import teamPlayVariant from "./teamPlayVariant";
import venusScoringVariant from "./venusScoringVariant";

const CARDS_PER_DECK = {
  base: [
    // the array is 0-indexed
    undefined,
    // I: ...
    MARKET_DECK_I.base.length,
    // II: Architect, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
    7,
    // III: Architect, Prefect, Mercator, Colonist, Diplomat, Consul
    6,
    // IV: Architect, Prefect, Colonist, Diplomat, Consul
    5,
    // V: Prefect, Mercator, Diplomat, Consul
    4,
  ],
  venus: [
    // the array is 0-indexed
    undefined,
    // I: ...
    MARKET_DECK_I.venus.length,
    // II: Mason, Architect/Mercator, Prefect, Mercator, Colonist, Consul, Vintner, Weaver
    8,
    // III: Architect, Prefect, Prefect/Mercator, Colonist, Diplomat, Consul
    6,
    // IV: Architect/Mercator, Prefect, Colonist, Diplomat, Consul
    5,
    // V: Prefect, Mercator, Diplomat, Consul
    4,
  ],
} as const;

type REPLACEMENT = [base: string, venus: string];
const VENUS_REPLACEMENTS: readonly REPLACEMENT[] = [
  ["Prefect", "Prefect/Architect"],
  ["Architect", "Architect/Mercator"],
  ["Mercator", "Prefect/Mercator"],
  ["Architect", "Architect/Mercator"],
];

const TEAM_PLAY_MAX_PLAYER_COUNT = 6;

export default createDerivedGameStep({
  id: "personalityCards",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    venusScoringVariant,
    teamPlayVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, products, venusScoring, teamPlay],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly ConcordiaProductId[],
  boolean
>): JSX.Element {
  const relevantProduct = products!.includes("base")
    ? products!.includes("venus")
      ? "venus"
      : "base"
    : "venusBase";

  // When playing without venus scoring with the venus base box there are
  // additional steps in order to set up the decks
  const baseWithVenusSteps =
    !venusScoring && !teamPlay && relevantProduct === "venusBase";

  return (
    <HeaderAndSteps synopsis="Prepare the personality cards decks:">
      <CardSelectionStep
        playerIds={playerIds}
        relevantProduct={relevantProduct}
        venusScoring={venusScoring ?? false}
        teamPlay={teamPlay ?? false}
      />
      {baseWithVenusSteps && <RemoveVenusCardsStep playerIds={playerIds} />}
      {baseWithVenusSteps && <AddReplacementCardsStep playerIds={playerIds} />}
      <>Create a separate deck for each numeral.</>
      {baseWithVenusSteps && (
        <>
          Move the{" "}
          <strong>
            <RomanTitle>Mason</RomanTitle>
          </strong>{" "}
          card from deck <strong>II</strong> to deck <strong>I</strong>.
        </>
      )}
    </HeaderAndSteps>
  );
}

function CardSelectionStep({
  playerIds,
  venusScoring,
  teamPlay,
  relevantProduct,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
  venusScoring: boolean;
  teamPlay: boolean;
  relevantProduct: "base" | "venus" | "venusBase";
}): JSX.Element {
  invariant(
    // This protects us from the only meaningless case which is that venus
    // scoring is turned on when there are no venus products. We need this here
    // because we handle each combination of product and scoring separately.
    !(relevantProduct === "base" && venusScoring),
    `Trying to setup a venus scoring game when no venus product is enabled`
  );

  invariant(
    // Protecting against a bad combination of the two flags.
    !venusScoring || !teamPlay,
    `Both Venus Scoring and Team Play can't be both turned on`
  );

  if (playerIds == null) {
    return (
      <UnknownPlayerCount
        venusScoring={venusScoring}
        relevantProduct={relevantProduct}
      />
    );
  }

  const playerCount = playerIds.length;
  return playerCount >=
    (teamPlay ? TEAM_PLAY_MAX_PLAYER_COUNT : CARDS_PER_DECK.base.length - 1) ? (
    <MaxPlayerCount
      teamPlay={teamPlay}
      venusScoring={venusScoring}
      relevantProduct={relevantProduct}
    />
  ) : (
    <PartialPlayerCount
      teamPlay={teamPlay}
      playerCount={playerCount}
      venusScoring={venusScoring}
      relevantProduct={relevantProduct}
    />
  );
}

function UnknownPlayerCount({
  venusScoring,
  relevantProduct,
}: {
  venusScoring: boolean;
  relevantProduct: "base" | "venus" | "venusBase";
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          e.g. for a 3 player game take all cards with numerals I, II, and III
          and leave cards with numerals IV and V in the box.
        </>,
        <AllCardsCountsFootnote
          venusDeck={relevantProduct === "venusBase" || venusScoring}
        />,
      ]}
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <CardBackDescription
            venusScoring={venusScoring}
            relevantProduct={relevantProduct}
          />
          {relevantProduct === "base"
            ? " with value "
            : ", and where the numeral value is "}
          up to and including the number of players;{" "}
          <em>
            leaving {relevantProduct === "venus" && "all "}cards with{" "}
            {relevantProduct === "venus" &&
              `${!venusScoring ? "VENVS" : "CONCORDIA"}, and cards with `}
            higher values in the box (they won't be needed)
          </em>
          <Footnote index={1} />
          <Footnote index={2} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function MaxPlayerCount({
  venusScoring,
  teamPlay,
  relevantProduct,
}: {
  venusScoring: boolean;
  teamPlay: boolean;
  relevantProduct: "base" | "venus" | "venusBase";
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <AllCardsCountsFootnote
          venusDeck={
            relevantProduct === "venusBase" || teamPlay || venusScoring
          }
        />
      }
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <CardBackDescription
            venusScoring={venusScoring}
            teamPlay={teamPlay}
            relevantProduct={relevantProduct}
          />
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function PartialPlayerCount({
  playerCount,
  venusScoring,
  teamPlay,
  relevantProduct,
}: {
  playerCount: number;
  venusScoring: boolean;
  teamPlay: boolean;
  relevantProduct: "base" | "venus" | "venusBase";
}): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <AllCardsCountsFootnote
          venusDeck={
            relevantProduct === "venusBase" || teamPlay || venusScoring
          }
        />
      }
    >
      {(Footnote) => (
        <>
          Take all cards with{" "}
          <CardBackDescription
            teamPlay={teamPlay}
            venusScoring={venusScoring}
            relevantProduct={relevantProduct}
          />
          {relevantProduct !== "venusBase" ? ", and with " : " with "}
          <GrammaticalList pluralize="value">
            {Vec.range(1, playerCount).map((i) => (
              <strong>{ROMAN_NUMERALS[i]}</strong>
            ))}
          </GrammaticalList>
          ; leaving {relevantProduct !== "venusBase" && "all "}cards with{" "}
          {relevantProduct === "venus" &&
            `${
              !venusScoring || !teamPlay ? "VENVS" : "CONCORDIA"
            }, and cards with `}
          <GrammaticalList pluralize="numeral">
            {Vec.range(playerCount + 1, CARDS_PER_DECK.base.length - 1).map(
              (x) => (
                <strong>{ROMAN_NUMERALS[x]!}</strong>
              )
            )}
          </GrammaticalList>{" "}
          in the box (they won't be needed)
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function RemoveVenusCardsStep({
  playerIds,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
}): JSX.Element {
  const venusCards =
    playerIds == null
      ? VENUS_REPLACEMENTS
      : Vec.take(VENUS_REPLACEMENTS, playerIds.length);

  return (
    <BlockWithFootnotes
      footnote={
        <>
          <GrammaticalList>
            {Vec.map(venusCards, ([_, card], index) => (
              <>
                {ROMAN_NUMERALS[index + 1]}: <RomanTitle>{card}</RomanTitle>
              </>
            ))}
          </GrammaticalList>
          .
        </>
      }
    >
      {(Footnote) => (
        <>
          Return to the box{" "}
          {playerIds != null ? `the ${venusCards.length}` : "all"} cards with
          double-roles and green <strong>VENVS</strong> scoring
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function AddReplacementCardsStep({
  playerIds,
}: {
  playerIds: readonly PlayerId[] | null | undefined;
}): JSX.Element {
  const venusCards =
    playerIds == null
      ? VENUS_REPLACEMENTS
      : Vec.take(VENUS_REPLACEMENTS, playerIds.length);

  const footnotes = Vec.concat(
    [
      <>
        <GrammaticalList>
          {Vec.map(venusCards, ([card, _], index) => (
            <>
              {ROMAN_NUMERALS[index + 1]}: <RomanTitle>{card}</RomanTitle>
            </>
          ))}
        </GrammaticalList>
        .
      </>,
    ],
    // We only need the other footnote when the player count isn't known
    playerIds == null ? (
      <>e.g. for a 3 player game take cards I, II, and III.</>
    ) : (
      []
    )
  );

  return (
    <BlockWithFootnotes footnotes={footnotes}>
      {(Footnote) => (
        <>
          Exchange the returned cards with{" "}
          {playerIds != null &&
            playerIds.length >= VENUS_REPLACEMENTS.length && <em>all </em>}
          cards that have <strong>neither</strong> <em>a pillar icon</em> nor{" "}
          <em>an interlocking circles icon</em> (on the bottom corners, on the
          back of the card)
          {playerIds != null ? (
            playerIds.length >= VENUS_REPLACEMENTS.length ? (
              ""
            ) : (
              <>
                {" "}
                and with numerals{" "}
                <GrammaticalList>
                  {Vec.map(venusCards, (_, index) => (
                    <strong>{ROMAN_NUMERALS[index + 1]}</strong>
                  ))}
                </GrammaticalList>
              </>
            )
          ) : (
            <>
              ; matching the roman numeral
              <Footnote index={2} />
            </>
          )}
          <Footnote index={1} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

function CardBackDescription({
  venusScoring,
  teamPlay = false,
  relevantProduct,
}: {
  venusScoring: boolean;
  teamPlay?: boolean;
  relevantProduct: "base" | "venus" | "venusBase";
}): JSX.Element {
  if (relevantProduct === "base") {
    return <>roman numerals on the back</>;
  }

  const icon = teamPlay ? (
    <>
      <em>an interlocking circles icon</em> (at the bottom right corner)
    </>
  ) : (
    <>
      <em>a small pillar icon</em> (at the bottom left corner)
    </>
  );

  if (relevantProduct === "venus") {
    if (!venusScoring && !teamPlay) {
      return (
        <>
          <strong>CONCORDIA</strong> and a roman numeral on the back
        </>
      );
    }
    return (
      <>
        <strong>VENVS</strong>, a roman numeral, and {icon}, all on the back of
        the card
      </>
    );
  }

  return <>a roman numeral and {icon} on the back</>;
}

function AllCardsCountsFootnote({
  venusDeck,
}: {
  venusDeck: boolean;
}): JSX.Element {
  return (
    <>
      <GrammaticalList>
        {Vec.filter_nulls(
          Vec.map(
            CARDS_PER_DECK[venusDeck ? "venus" : "base"],
            (count, index) =>
              count != null ? (
                <>
                  {count} cards with numeral{" "}
                  <strong>
                    <RomanTitle>{ROMAN_NUMERALS[index]}</RomanTitle>
                  </strong>
                </>
              ) : null
          )
        )}
      </GrammaticalList>
      .
    </>
  );
}