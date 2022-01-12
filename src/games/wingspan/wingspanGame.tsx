import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { createPlayerColorsStep } from "games/global";
import automaBonusCardStep from "./steps/automaBonusCardStep";
import automaOnlyBonusCardsVariant from "./steps/automaOnlyBonusCardsVariant";
import automaStep from "./steps/automaStep";
import birdCardsStep from "./steps/birdCardsStep";
import bonusCardsStep from "./steps/bonusCardsStep";
import europeanBirdsVariant from "./steps/europeanBirdsVariant";
import europeReferenceTileStep from "./steps/europeReferenceTileStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import friendlyGoalsVariant from "./steps/friendlyGoalsVariant";
import goalBoardStep from "./steps/goalBoardStep";
import goalTilesStep from "./steps/goalTilesStep";
import keepBirdCardsStep from "./steps/keepBirdCardsStep";
import keepBonusCardsStep from "./steps/keepBonusCardsStep";
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
    europeanBirdsVariant, // Variant
    automaOnlyBonusCardsVariant, // Variant

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

    europeReferenceTileStep,

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
    automaBonusCardStep,
    bonusCardsStep,

    swiftStartGuidesSteps,

    keepBirdCardsStep,
    keepBonusCardsStep,
  ],
});
