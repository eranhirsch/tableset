import { GamePiecesColor } from "../core/themeWithGameColors";

export default abstract class Game {
  public abstract get playerColors(): GamePiecesColor[];
}
