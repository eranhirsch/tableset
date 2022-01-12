import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { createPlayerColorsStep } from "games/global";
import automaStep from "./steps/automaStep";
import birdCardsStep from "./steps/birdCardsStep";
import bonusCardsStep from "./steps/bonusCardsStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import friendlyGoalsVariant from "./steps/friendlyGoalsVariant";
import goalBoardStep from "./steps/goalBoardStep";
import goalTilesStep from "./steps/goalTilesStep";
import keepCardsStep from "./steps/keepCardsStep";
import playerComponentsStep from "./steps/playerComponentsStep";
import playOrderStep from "./steps/playOrderStep";
import productsMetaStep from "./steps/productsMetaStep";
import supplyStep from "./steps/supplyStep";
import swiftStartGuidesSteps from "./steps/swiftStartGuidesSteps";
import swiftStartVariant from "./steps/swiftStartVariant";

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
    swiftStartVariant, // Variant
    friendlyGoalsVariant, // Variant

    birdCardsStep,
    supplyStep,
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

    playOrderStep, // Templatable
    firstPlayerStep, // Templatable
    createPlayerColorsStep({
      productsMetaStep,
      availableColors: () => ["blue", "red", "yellow", "purple", "green"],
    }), // Templatable

    playerComponentsStep,
    automaStep,
    bonusCardsStep,

    swiftStartGuidesSteps,

    keepCardsStep,

    createGameStep({
      id: "keepBonusCard",
      InstanceManualComponent:
        "Chose 1 bonus card to keep, and discard the other. You may look at " +
        "your bonus cards while selecting which birds to keep (and vice " +
        "versa).",
    }),
  ],
});
