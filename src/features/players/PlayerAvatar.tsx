import { Avatar } from "@mui/material";
import { PlayerId } from "model/Player";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

export function PlayerAvatar({
  playerId,
  inline = false,
}: {
  playerId: PlayerId;
  inline?: boolean;
}): JSX.Element | null {
  return (
    <Avatar
      {...(inline ? { component: "span", sx: { display: "inline-flex" } } : {})}
    >
      <PlayerNameShortAbbreviation playerId={playerId} />
    </Avatar>
  );
}
