import { Str } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import firstPlayerStep from "games/bloodRage/steps/firstPlayerStep";
import playOrderStep from "games/bloodRage/steps/playOrderStep";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { partialPlayOrder, playersMetaStep } from "games/global";
import { useMemo } from "react";
import { SWIFT_START } from "./swiftStartGuidesSteps";
import swiftStartVariant from "./swiftStartVariant";

export default createDerivedGameStep({
  id: "keepCards",
  dependencies: [
    playersMetaStep,
    playOrderStep,
    firstPlayerStep,
    swiftStartVariant,
  ],
  skip: ([playerIds, _playOrder, _firstPlayerId, isSwiftStart]) =>
    playerIds!.length <= SWIFT_START.length && isSwiftStart!,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, playOrder, firstPlayerId, isSwiftStart],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  PlayerId,
  boolean
>): JSX.Element {
  const order = useMemo(
    () => partialPlayOrder(playerIds!, firstPlayerId, playOrder),
    [firstPlayerId, playOrder, playerIds]
  );
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          You will probably want to keep food tokens shown in the upper left of
          the bird cards you selected.
        </>,
        <>
          For example, you might keep 2 bird cards and 3 food, or you might keep
          4 bird cards and 1 food.
        </>,
        <>You can look at your bonus cards while making your selection.</>,
      ]}
    >
      {(Footnote) => (
        <>
          {isSwiftStart &&
            (order[SWIFT_START.length] != null ? (
              <PlayerAvatar playerId={order[SWIFT_START.length]!} inline />
            ) : (
              `the ${SWIFT_START.length + 1}${Str.number_suffix(
                SWIFT_START.length + 1
              )} player`
            ))}{" "}
          Keep up to <strong>5</strong> bird cards and discard the others
          <Footnote index={1} />.{" "}
          <strong>
            For each bird card you keep, you must discard 1 food token.
          </strong>
          <Footnote index={2} />
          <Footnote index={3} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
