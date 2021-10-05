import { PlayerId } from "model/Player";
import { ProductId } from "./Game";

export interface ContextBase {
  playerIds: readonly PlayerId[];
  productIds: readonly ProductId[];
}
