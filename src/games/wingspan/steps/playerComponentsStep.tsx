import { Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import React from "react";
import { Food, FoodTypeId } from "../utils/Food";
import oceaniaBirdsVariant from "./oceaniaBirdsVariant";
import productsMetaStep, { WingspanProductId } from "./productsMetaStep";
import swiftStartVariant from "./swiftStartVariant";

export const BIRD_CARDS_PER_PLAYER = 5;

const STARTING_FOOD: readonly FoodTypeId[] = [
  "fish",
  "fruit",
  "invertebrate",
  "rodent",
  "seed",
] as const;

export default createDerivedGameStep({
  id: "playerComponents",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    swiftStartVariant,
    oceaniaBirdsVariant,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, productIds, isSwiftStart, isOceania],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly WingspanProductId[],
  boolean,
  boolean
>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <HeaderAndSteps synopsis={`${isSolo ? "Take" : "Each player receives"}:`}>
      <>
        <strong>1</strong> player mat{" "}
        {productIds!.includes("oceania") && (
          <>
            <strong>with{!isOceania && "out"}</strong> {Food.LABELS.nectar}{" "}
            icons on it
          </>
        )}
        .
      </>
      <>
        <strong>8</strong> action cubes of {isSolo ? "your" : "their"} color.
      </>
      {!isSwiftStart && (
        <>
          <strong>{BIRD_CARDS_PER_PLAYER}</strong> random bird cards
          {
            // TODO: We can consider this a variant, but it probably would be
            // overkill to also make this a random step and randomize the birds
            // for each player (it would require us to have a list of all 170
            // birds, and for the players to scan the deck to find them)
            !isSolo && (
              <>
                ;{" "}
                <em>
                  You may keep your hand of cards private or public throughout
                  the game.
                </em>
              </>
            )
          }
          .
        </>
      )}
      {!isSwiftStart && (
        <>
          Food tokens:
          <GrammaticalList>
            {React.Children.toArray(
              Vec.map(STARTING_FOOD, (foodId) => (
                <strong>{Food.LABELS[foodId]}</strong>
              ))
            )}
          </GrammaticalList>
          {productIds!.includes("oceania") && (
            <em>; but not {Food.LABELS.nectar}!</em>
          )}
          .
        </>
      )}
    </HeaderAndSteps>
  );
}
