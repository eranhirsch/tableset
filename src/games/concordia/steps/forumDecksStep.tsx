import { Dict, Str, Vec } from "common";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { FORUM_TILES } from "../utils/ForumTilesEncoder";
import forumVariantStep from "./forumVariant";

export default createDerivedGameStep({
  id: "forumDecks",
  dependencies: [forumVariantStep],
  skip: ([forum]) => forum == null,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <>
          There are
          <GrammaticalList>
            {Vec.map_with_key(
              Dict.map(FORUM_TILES, ({ tiles }) => tiles.length),
              (type, count) => (
                <>
                  {count} <strong>{Str.capitalize(type)}</strong> tiles
                </>
              )
            )}
          </GrammaticalList>
          .
        </>
      }
    >
      {(Footnote) => (
        <>
          Split the forum tiles into {Dict.size(FORUM_TILES)} decks based on the
          color of their name's background;{" "}
          <GrammaticalList>
            {Vec.map_with_key(FORUM_TILES, (type, { color }) => (
              <>
                <em>{Str.capitalize(type)}</em>s have a <strong>{color}</strong>{" "}
                background
              </>
            ))}
          </GrammaticalList>
          <Footnote />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
