import PlayerColors from "../../../common/PlayerColors";
import { colorName } from "../../../core/themeWithGameColors";
import { PlayerShortName } from "./PlayerShortName";

export default function PlayersColorsFixedTemplateLabel({
  value,
}: {
  value: PlayerColors;
}): JSX.Element {
  return (
    <>
      {Object.entries(value)
        .map(([playerId, color]) => (
          <>
            <PlayerShortName playerId={playerId} />: {colorName(color)}
          </>
        ))
        .join(", ")}
    </>
  );
}
