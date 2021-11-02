import { MathUtils, Vec } from "common";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { useMemo } from "react";

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

const ENCOUNTER_TOKENS_COUNT = 12;

export default createDerivedGameStep({
  id: "encounterTokens",
  dependencies: [],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  const tokensLocationCount = useMemo(
    () =>
      MathUtils.sum(Vec.map(ENCOUNTER_LOCATIONS, (columns) => columns.length)),
    []
  );
  const unusedTokens = ENCOUNTER_TOKENS_COUNT - tokensLocationCount;
  return (
    <BlockWithFootnotes
      footnotes={[
        <>Small green circular chits with a golden star on them.</>,
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
        </>,
      ]}
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
              </em>
            </>
          )}
          .
        </>
      )}
    </BlockWithFootnotes>
  );
}
