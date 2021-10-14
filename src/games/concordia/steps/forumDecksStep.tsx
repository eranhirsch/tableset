import { Dict, Str, Vec } from "common";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import forumVariantStep from "./forumVariantStep";

const TILES = {
  citizen: {
    color: "green",
    tiles: [
      /* spell-checker: disable */
      "Mamercus",
      "Mamilius",
      "Marcus",
      "Augustus",
      "Commodus",
      "Julius",
      "Laurentius",
      "Novius",
      "Numerius",
      "Publius",
      "Quintus",
      "Spurius",
      "Tiberius",
      "Victoria",
      /* spell-checker: enable */
    ],
  },
  patrician: {
    color: "blue",
    tiles: [
      /* spell-checker: disable */
      "Annaeus	Arcadius",
      "Appius	Arcadius",
      "Aulus	Arcadius",
      "Faustus	Marcellus",
      "Gaius	Marcellus",
      "Servius	Marcellus",
      "Claudius	Pompeius",
      "Donatus	Pompeius",
      "Lucius	Flavius",
      "Cornelius	Scipio",
      "Sextus	Pompeius",
      "Titus	Valerius",
      "Claudia	Agrippina",
      /* spell-checker: enable */
    ],
  },
} as const;

export default createDerivedGameStep({
  id: "forumDecks",
  dependencies: [forumVariantStep],
  skip: ([forum]) => forum == null,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          There are
          <GrammaticalList>
            {Vec.map_with_key(
              Dict.map(TILES, ({ tiles }) => tiles.length),
              (type, count) => (
                <>
                  {count} <strong>{Str.capitalize(type)}</strong> tiles
                </>
              )
            )}
          </GrammaticalList>
          .
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Split the forum tiles into {Dict.size(TILES)} decks based on the color
          of their name's background;{" "}
          <GrammaticalList>
            {Vec.map_with_key(TILES, (type, { color }) => (
              <>
                <em>{Str.capitalize(type)}</em>s have a <strong>{color}</strong>{" "}
                background
              </>
            ))}
          </GrammaticalList>
          <Footnote index={1} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
