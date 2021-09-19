import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { PlayerId } from "../../../core/model/Player";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import { PlayerShortName } from "./PlayerShortName";

export default function PlayOrderFixedTemplateLabel({
  value,
}: {
  value: readonly PlayerId[];
}): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);
  return (
    <>
      {React.Children.toArray(
        [firstPlayerId].concat(value).map((playerId, idx) => (
          <>
            <PlayerShortName playerId={playerId} />
            {idx < value.length && (
              <NavigateNextIcon
                fontSize="small"
                sx={{ verticalAlign: "middle" }}
              />
            )}
          </>
        ))
      )}
    </>
  );
}
