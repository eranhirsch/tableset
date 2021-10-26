import { Vec } from "common";
import createPlayerColorsStep from "games/global/steps/createColorsStep";
import { GamePiecesColor } from "model/GamePiecesColor";
import productsMetaStep from "./productsMetaStep";

const BASE_COLORS: readonly GamePiecesColor[] = [
  "black",
  "blue",
  "green",
  "red",
  "yellow",
];
const VENUS_COLORS: readonly GamePiecesColor[] = ["white"];

export default createPlayerColorsStep({
  productsMetaStep: productsMetaStep,
  availableColors: (_, products): readonly GamePiecesColor[] =>
    Vec.concat(
      BASE_COLORS,
      products.includes("venus") || products.includes("venusBase")
        ? VENUS_COLORS
        : []
    ),
});
