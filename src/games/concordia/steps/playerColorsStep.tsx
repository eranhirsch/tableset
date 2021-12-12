import { ColorId } from "app/utils/Colors";
import { Vec } from "common";
import { createPlayerColorsStep } from "games/global";
import productsMetaStep from "./productsMetaStep";

const BASE_COLORS: readonly ColorId[] = [
  "black",
  "blue",
  "green",
  "red",
  "yellow",
];
const VENUS_COLORS: readonly ColorId[] = ["white"];

export default createPlayerColorsStep({
  productsMetaStep,
  availableColors: (_, products): readonly ColorId[] =>
    Vec.concat(
      BASE_COLORS,
      products.includes("venus") || products.includes("venusBase")
        ? VENUS_COLORS
        : []
    ),
});
