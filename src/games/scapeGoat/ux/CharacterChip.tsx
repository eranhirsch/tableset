import { Chip } from "@mui/material";
import { CharacterId, Characters } from "../utils/Characters";

export function CharacterChip({
  characterId,
  small,
}: {
  characterId: CharacterId;
  small?: boolean;
}): JSX.Element {
  return (
    <Chip
      size={small ? "small" : undefined}
      color={Characters.color(characterId)}
      label={`${small ? "" : "The "}${Characters.label(characterId)}`}
    />
  );
}
