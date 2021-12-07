import { Typography } from "@mui/material";
import { $, C, MathUtils } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { Characters } from "../utils/Characters";
import playerMatsStep from "./playerMatsStep";
import startLocationStep from "./startLocationStep";

export default createDerivedGameStep({
  id: "firstPlayer",
  dependencies: [playersMetaStep, playerMatsStep, startLocationStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, mats, locationsIdx],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly PlayerId[],
  number
>): JSX.Element {
  const firstPlayerId = useMemo(() => {
    if (locationsIdx == null || mats == null) {
      return null;
    }

    const characters = Characters.forPlayerCount(mats.length);
    return $(
      // Decode the locations idx
      MathUtils.permutations_lazy_array(characters),
      ($$) => $$.at(locationsIdx),
      $.nullthrows(`Locations index ${locationsIdx} is out of range`),
      // Take the first character placed (which would be the Prepare location)
      C.firstx,
      // Find what index that character is in the mats array
      ($$) => characters.indexOf($$),
      // And take the player at that index
      ($$) => mats[$$]
    );
  }, [locationsIdx, mats]);

  const playDirection = "play continues clockwise after that";

  if (firstPlayerId == null) {
    return (
      <Typography variant="body1">
        The player whose character token{" "}
        {playerIds!.length > 4 ? (
          <>
            was put <strong>first</strong>
          </>
        ) : (
          <>is</>
        )}{" "}
        on the <em>Prepare</em> location card plays first; {playDirection}.
      </Typography>
    );
  }

  return (
    <Typography variant="body1">
      <PlayerAvatar playerId={firstPlayerId} inline /> goes first;{" "}
      {playDirection}.
    </Typography>
  );
}
