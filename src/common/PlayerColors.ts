import { GamePiecesColor } from "../core/themeWithGameColors";

export default interface PlayerColors {
  [playerId: string]: GamePiecesColor;
}
