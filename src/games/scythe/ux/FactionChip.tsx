import { Chip } from "@mui/material";
import { FactionId, Factions } from "../utils/Factions";

export function FactionChip({
  factionId,
}: {
  factionId: FactionId;
}): JSX.Element {
  const { color, name } = Factions[factionId];
  return <Chip size="small" color={color} label={name} />;
}
