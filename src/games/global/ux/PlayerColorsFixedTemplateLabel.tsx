import { Chip } from "@mui/material";
import React from "react";
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
      {React.Children.toArray(
        Object.entries(value).map(([playerId, color]) => (
          <Chip
            component="span"
            size="small"
            color={color}
            label={<PlayerShortName playerId={playerId} />}
          />
        ))
      )}
    </GrammaticalList>
  );
}
