import { Avatar } from "@mui/material";
import { PlayerId } from "model/Player";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

export function PlayerAvatar({
  playerId,
  inline = false,
  size,
  onClick,
}: {
  playerId: PlayerId;
  inline?: boolean;
  size?: number;
  onClick?(): void;
}): JSX.Element | null {
  return (
    <Avatar
      {...(inline ? { component: "span", sx: { display: "inline-flex" } } : {})}
      sx={size != null ? { width: size, height: size, fontSize: size / 2 } : {}}
      onClick={onClick}
    >
      <PlayerNameShortAbbreviation playerId={playerId} />
    </Avatar>
  );
}
