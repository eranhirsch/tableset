import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";
import advancedVariant from "./steps/advancedVariant";
import cardsStep from "./steps/cardsStep";
import courtStep from "./steps/courtStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import followersStep from "./steps/followersStep";
import playOrderStep from "./steps/playOrderStep";
import regionCards from "./steps/regionCards";
import supplyStep from "./steps/supplyStep";
import teamsStep from "./steps/teamsStep";
import teamVariant from "./steps/teamVariant";

const productsMetaStep = createProductsMetaStep();

export default createGame({
  id: "theKingIsDead2",
  name: "The King is Dead: Second Edition",
  productsMetaStep,
  products: {
    base: {
      name: "The King is Dead: Second Edition",
      isBase: true,
      year: 2020,
      bggId: 319966,
    },
  },
  steps: [
    advancedVariant, // Variant
    teamVariant, // Variant

    createGameStep({
      id: "board",
      InstanceManualComponent: "Place the board in the middle of the table.",
    }),

    firstPlayerStep, // Templatable
    teamsStep, // Templatable
    playOrderStep, // Templatable

    courtStep, // Templatable
    followersStep, // Templatable

    supplyStep,

    createGameStep({
      id: "negotiationDisc",
      InstanceManualComponent: "Give each player a negotiation disc.",
    }),
    createGameStep({
      id: "controlDiscs",
      InstanceManualComponent: "Place all the control discs in the supply.",
    }),
    createGameStep({
      id: "instabilityDiscs",
      InstanceManualComponent: "Place all the instability discs in France.",
    }),

    cardsStep,
    regionCards, // Templatable

    createGameStep({
      id: "victoryCard",
      InstanceManualComponent:
        "Place the victory card near the board where it is easily accessible.",
    }),
  ],
});
