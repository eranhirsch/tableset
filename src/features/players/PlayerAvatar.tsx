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
  const sizeSx =
    size != null ? { width: size, height: size, fontSize: size / 2 } : {};
  return (
    <Avatar
      {...(inline
        ? { component: "span", sx: { display: "inline-flex", ...sizeSx } }
        : { sx: sizeSx })}
      // IMPORTANT: DONT add an `sx` property here directly it would remove the
      // other settings! (see the spread above)
      onClick={onClick}
    >
      <PlayerNameShortAbbreviation playerId={playerId} />
    </Avatar>
  );
}
