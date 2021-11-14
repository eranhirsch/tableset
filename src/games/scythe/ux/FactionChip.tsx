import { Chip } from "@mui/material";
import { FactionId, Factions } from "../utils/Factions";

export function FactionChip({
  factionId,
  onClick,
}: {
  factionId: FactionId;
  onClick?(): void;
}): JSX.Element {
  const { color, name } = Factions[factionId];
  return <Chip size="small" color={color} label={name} onClick={onClick} />;
}
