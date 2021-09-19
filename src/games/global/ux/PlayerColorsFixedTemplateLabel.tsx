import { Chip } from "@material-ui/core";
import PlayerColors from "../../../common/PlayerColors";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { PlayerShortName } from "./PlayerShortName";

export default function PlayersColorsFixedTemplateLabel({
  value,
}: {
  value: PlayerColors;
}): JSX.Element {
  return (
    <GrammaticalList>
      {Object.entries(value).map(([playerId, color]) => (
        <Chip
          size="small"
          color={color}
          label={<PlayerShortName playerId={playerId} />}
        />
      ))}
    </GrammaticalList>
  );
}
