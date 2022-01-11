import { Typography } from "@mui/material";
import { Vec } from "common";
import { createGameStep } from "games/core/steps/createGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import React from "react";

const ALL_FOOD_TYPE_IDS = [
  "fish",
  "fruit",
  "invertebrate",
  "rodent",
  "seed",
] as const;
type FoodTypeId = typeof ALL_FOOD_TYPE_IDS[number];

const FOOT_TYPE_LABELS: Readonly<Required<Record<FoodTypeId, string>>> = {
  fish: "Fish",
  fruit: "Fruit",
  invertebrate: "Invertebrate",
  rodent: "Rodent",
  seed: "Seed",
};

export default createGameStep({
  id: "playerComponents",
  InstanceManualComponent,
});

function InstanceManualComponent(): JSX.Element {
  return (
    <>
      <HeaderAndSteps synopsis="Each player receives:">
        <>
          <strong>1</strong> player mat.
        </>
        <>
          <strong>8</strong> action cubes of their color.
        </>
        <>
          <strong>2</strong> random bonus cards.
        </>
        <>
          <strong>5</strong> random bird cards.
        </>
        <BlockWithFootnotes
          footnote={
            <>
              The types are:{" "}
              <GrammaticalList>
                {React.Children.toArray(
                  Vec.map(ALL_FOOD_TYPE_IDS, (food) => (
                    <>{FOOT_TYPE_LABELS[food]}</>
                  ))
                )}
              </GrammaticalList>
            </>
          }
        >
          {(Footnote) => (
            <>
              <strong>5</strong> food tokens
              <em>
                ; <strong>1</strong> of each type
                <Footnote />.
              </em>
            </>
          )}
        </BlockWithFootnotes>
      </HeaderAndSteps>
      <Typography variant="body2" marginTop={2}>
        {/* TODO: Should this be a formal variant? we can randomize and show the
        cards in that case. */}
        <em>
          You may keep your hand of cards private or public throughout the game.
        </em>
      </Typography>
    </>
  );
}
