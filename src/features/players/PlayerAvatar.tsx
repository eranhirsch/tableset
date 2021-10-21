import { Avatar } from "@mui/material";
import { PlayerId } from "model/Player";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

export function PlayerAvatar({
  playerId,
  inline = false,
  onClick,
}: {
  playerId: PlayerId;
  inline?: boolean;
  onClick?(): void;
}): JSX.Element | null {
  return (
    <Avatar
      {...(inline ? { component: "span", sx: { display: "inline-flex" } } : {})}
      onClick={onClick}
    >
      <PlayerNameShortAbbreviation playerId={playerId} />
    </Avatar>
  );
}
