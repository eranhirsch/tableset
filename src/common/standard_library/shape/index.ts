import { Shape as asyncShape } from "./async";
import { Shape as combineShape } from "./combine";
import { Shape as divideShape } from "./divide";
import { Shape as selectShape } from "./select";
import { Shape as transformShape } from "./transform";

export const Shape = {
  ...asyncShape,
  ...combineShape,
  ...divideShape,
  ...selectShape,
  ...transformShape,
} as const;
