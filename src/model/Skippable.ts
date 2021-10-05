import { InstanceContext } from "../games/core/steps/createRandomGameStep";

export interface Skippable {
  skip(context: InstanceContext): boolean;
}

export const isSkippable = (x: unknown): x is Skippable =>
  (x as Partial<Skippable>).skip != null;
