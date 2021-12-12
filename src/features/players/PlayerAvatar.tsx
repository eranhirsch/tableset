import { Avatar } from "@mui/material";
import { SxProps } from "@mui/system";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";
import { PlayerId } from "./playersSlice";

export function PlayerAvatar({
  playerId,
  inline = false,
  size,
  onClick,
  sx,
}: {
  playerId: PlayerId;
  inline?: boolean;
  size?: number;
  onClick?(): void;
  sx?: SxProps;
}): JSX.Element | null {
  const realSx = {
    ...sx,
    ...(inline ? { display: "inline-flex" } : undefined),
    ...(size != null
      ? { width: size, height: size, fontSize: size / 2 }
      : undefined),
  };
  return (
    <Avatar
      sx={realSx}
      {...(inline ? { component: "span" } : {})}
      // IMPORTANT: DONT add an `sx` property here directly it would remove the
      // other settings! (see the spread above)
      onClick={onClick}
    >
      <PlayerNameShortAbbreviation playerId={playerId} />
    </Avatar>
  );
}
