import { GamePiecesColor } from "../core/themeWithGameColors";

type PlayerColors = Readonly<{
  [playerId: string]: GamePiecesColor;
}>;
export default PlayerColors;
