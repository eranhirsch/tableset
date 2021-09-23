import { Chip } from "@mui/material";
import { Vec } from "common";
import { PlayerId } from "model/Player";
import React from "react";
import GrammaticalList from "../../core/ux/GrammaticalList";
import { PlayerColors } from "../steps/createPlayerColorsStep";
import { PlayerShortName } from "./PlayerShortName";

export default function PlayersColorsFixedTemplateLabel({
  value,
}: {
  value: PlayerColors;
}): JSX.Element {
  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map_with_key(value, (playerId, color) => (
          <Chip
            component="span"
            size="small"
            color={color}
            // TODO: Something about the typing of Vec.map_with_key isn't
            // inferring the keys of the Record properly, sending a number type
            // here. We need to fix the typing there and then remove the `as`
            // here
            label={<PlayerShortName playerId={playerId as PlayerId} />}
          />
        ))
      )}
    </GrammaticalList>
  );
}
