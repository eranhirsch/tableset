import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { createFirstPlayerStep, createPlayOrderStep } from "games/global";
import birdCardsStep from "./steps/birdCardsStep";
import friendlyGoalsVariant from "./steps/friendlyGoalsVariant";
import goalBoardStep from "./steps/goalBoardStep";
import goalTilesStep from "./steps/goalTilesStep";
import productsMetaStep from "./steps/productsMetaStep";

export default createGame({
  id: "wingspan",
  name: "Wingspan",
  productsMetaStep,
  products: {
    base: {
      name: "Wingspan",
      bggId: 266192,
      isBase: true,
      year: 2019,
      isNotImplemented: true,
    },
    swiftStart: {
      name: "Swift-Start Promo Pack",
      bggId: 290837,
      year: 2019,
      isNotImplemented: true,
    },
    europe: {
      name: "European Expansion",
      bggId: 290448,
      year: 2019,
      isNotImplemented: true,
    },
    oceania: {
      name: "Oceania Expansion",
      bggId: 300580,
      year: 2020,
      isNotImplemented: true,
    },
  },
  steps: [
    friendlyGoalsVariant, // Variant

    birdCardsStep,
    createGameStep({
      id: "supply",
      InstanceManualComponent:
        "Place all food and egg tokens in the supply. These are tokens accessible to all players.",
    }),
    createGameStep({
      // TODO: This step could be randomized as the results are random, but it
      // might be too pedantic as it has marginal impact on game and and the
      // cost to build it properly would be too high.
      id: "birdFeeder",
      InstanceManualComponent:
        // TODO: We should add the number of dice that are thrown
        "Toss the food dice into the birdfeeder dice tower.",
    }),
    goalBoardStep,
    goalTilesStep,
    createGameStep({
      id: "bonusCards",
      InstanceManualComponent:
        // TODO: Add card numbers here
        "Shuffle the bonus cards into a deck and place it on the table.",
    }),
    createPlayOrderStep(),
    createFirstPlayerStep({ FirstPlayerToken: "first-player token" }),
  ],
});
