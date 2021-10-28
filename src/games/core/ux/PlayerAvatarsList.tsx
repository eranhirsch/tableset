import { Vec } from "common";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "model/Player";
import React from "react";
import { GrammaticalList } from "./GrammaticalList";

export function PlayerAvatarsList({
  playerIds,
  playerAvatarProps,
}: {
  playerIds: readonly PlayerId[];
  playerAvatarProps?: Omit<
    Parameters<typeof PlayerAvatar>[0],
    "inline" | "playerId"
  >;
}): JSX.Element {
  return (
    <GrammaticalList>
      {React.Children.toArray(
        Vec.map(playerIds, (playerId) => (
          <PlayerAvatar playerId={playerId} inline {...playerAvatarProps} />
        ))
      )}
    </GrammaticalList>
  );
}
