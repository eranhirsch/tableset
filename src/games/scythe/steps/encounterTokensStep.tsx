import { MathUtils, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { ModularMapTiles } from "../utils/ModularMapTiles";
import modularBoardVariant from "./modularBoardVariant";
import removeModularTilesStep from "./removeModularTilesStep";

/**
 * Each item represents a row from top to bottom, and inside each number
 * represents a column from left to right. All numbers are zero-based.
 */
const ENCOUNTER_LOCATIONS: readonly (readonly number[])[] = [
  [2],
  [1, 4, 6],
  [],
  [1, 5],
  [0],
  [1, 2, 5],
  [3],
];

const MODULAR_ENCOUNTER_TOKENS = 3;

const ENCOUNTER_TOKENS_COUNT = 12;

export default createDerivedGameStep({
  id: "encounterTokens",
  dependencies: [playersMetaStep, modularBoardVariant],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isModular],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  const tokensLocationCount = useMemo(
    () =>
      isModular
        ? MODULAR_ENCOUNTER_TOKENS +
          ModularMapTiles.inPlay(playerIds!.length) * 2
        : MathUtils.sum(
            Vec.map(ENCOUNTER_LOCATIONS, (columns) => columns.length)
          ),
    [isModular, playerIds]
  );
  const unusedTokens = ENCOUNTER_TOKENS_COUNT - tokensLocationCount;
  return (
    <BlockWithFootnotes
      footnotes={Vec.filter_nulls([
        <>Small green circular chits with a golden compass on them.</>,
        isModular ? (
          <>
            There are {MODULAR_ENCOUNTER_TOKENS} encounter tokens on the main
            board, and 2 encounters on each map tile.
          </>
        ) : (
          <>
            Tokens are located (top to bottom and left to right){" "}
            <GrammaticalList>
              {Vec.filter_nulls(
                Vec.map(ENCOUNTER_LOCATIONS, (columns, row) =>
                  Vec.is_empty(columns) ? null : (
                    <>
                      on row {row + 1}: column{columns.length > 1 && "s"}{" "}
                      <GrammaticalList>
                        {Vec.map(columns, (col) => (
                          <>{col + 1}</>
                        ))}
                      </GrammaticalList>
                    </>
                  )
                )
              )}
            </GrammaticalList>
          </>
        ),
        isModular &&
        ModularMapTiles.inPlay(playerIds!.length) <
          ModularMapTiles.MAX_IN_PLAY ? (
          <InstanceStepLink step={removeModularTilesStep} />
        ) : null,
      ])}
    >
      {(Footnote) => (
        <>
          Place {tokensLocationCount} encounter tokens
          <Footnote index={1} /> on their locations on the board
          <Footnote index={2} />
          {unusedTokens > 0 && (
            <>
              ,{" "}
              <em>
                returning {unusedTokens} unused token{unusedTokens > 1 && "s"}{" "}
                back to the box
                {isModular && (
                  <>
                    . (there might be more locations if you didn't remove{" "}
                    {ModularMapTiles.inPlay(playerIds!.length) < 3 && "all "}
                    tiles
                    <Footnote index={3} />)
                  </>
                )}
              </em>
            </>
          )}
          .
        </>
      )}
    </BlockWithFootnotes>
  );
}
