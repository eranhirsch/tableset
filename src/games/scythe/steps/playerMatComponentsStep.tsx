import { Vec } from "common";
import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React from "react";

interface Structure {
  name: string;
  action: string;
  shape: string;
}
const STRUCTURES: readonly Readonly<Structure>[] = [
  { name: "Mine", action: "move", shape: "Arc" },
  { name: "Armory", action: "trade", shape: "Octagonal prism" },
  { name: "Mill", action: "produce", shape: "4-handed meeple-like" },
  { name: "Monument", action: "bolster", shape: "Pyramid" },
];

export default createGameStep({
  id: "playerMatComponents",
  labelOverride: "Player Mat Setup",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Players set up their <em>player mat</em> by placing the wooden
          components of their faction's color on the designated spots:
        </>
      }
    >
      <>
        <strong>Worker meeples (6):</strong> on the top row in the{" "}
        <em>produce</em> action, covering the 6 red slots;{" "}
        <em>
          you should have <strong>2</strong> workers remaining, keep those for a
          later step
        </em>
        .
      </>
      <>
        <strong>Upgrade cubes (6):</strong> on the top row in the sunken squares
        with a small black square on their bottom right corner.
      </>
      <BlockWithFootnotes
        footnotes={Vec.map(STRUCTURES, ({ shape }) => (
          <>{shape}.</>
        ))}
      >
        {(Footnote) => (
          <>
            <strong>Structures ({STRUCTURES.length}):</strong> on the top row;{" "}
            <GrammaticalList>
              {React.Children.toArray(
                Vec.map(STRUCTURES, ({ name, action }, index) => (
                  <>
                    the <strong>{name}</strong>
                    <Footnote index={index + 1} /> in the <em>{action}</em>{" "}
                    action
                  </>
                ))
              )}
            </GrammaticalList>
            .
          </>
        )}
      </BlockWithFootnotes>
      <>
        <strong>Cylinder recruits (4):</strong> on the bottom right corner of
        each column.
      </>
      <>
        <strong>Action Pawn (1):</strong> near (but not on) the board.
      </>
    </HeaderAndSteps>
  );
}
