import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";
import bagStep from "./steps/bagStep";
import courtStep from "./steps/courtStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import followersStep from "./steps/followersStep";
import homeRegionStep from "./steps/homeRegionStep";
import playOrderStep from "./steps/playOrderStep";

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
    createGameStep({
      id: "board",
      InstanceManualComponent: "Place the board in the middle of the table.",
    }),

    homeRegionStep,

    firstPlayerStep,
    playOrderStep,

    courtStep,
    followersStep,

    bagStep,
  ],
});
