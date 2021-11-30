import { Chip } from "@mui/material";
import { FactionId, Factions } from "../utils/Factions";

export function FactionChip({
  factionId,
  onClick,
  inline,
}: {
  factionId: FactionId;
  onClick?(): void;
  inline?: boolean;
}): JSX.Element {
  const {
    color,
    name: { short },
  } = Factions[factionId];
  return (
    <Chip
      component={inline ? "span" : "div"}
      size="small"
      color={color}
      label={short}
      onClick={onClick}
    />
  );
}
