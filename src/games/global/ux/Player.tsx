import { Avatar } from "@material-ui/core";
import { PlayerId } from "../../../core/model/Player";
import { PlayerNameShortAbbreviation } from "./PlayerNameShortAbbreviation";

export default function Player({
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
