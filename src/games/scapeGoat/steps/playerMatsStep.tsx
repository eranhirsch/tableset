import { Stack } from "@mui/material";
import { Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import { useMemo } from "react";
import { Characters } from "../utils/Characters";
import { CharacterChip } from "../ux/CharacterChip";

export default createRandomGameStep({
  id: "playerMats",
  dependencies: [playersMetaStep],
  isTemplatable: () => true,

  resolve: (_, playerIds) => Random.shuffle(playerIds!),

  InstanceVariableComponent,
  InstanceCards,

  ...NoConfigPanel,

  instanceAvroType: { type: "array", items: "string" },
});

function InstanceVariableComponent({
  value: order,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const playerCharacter = useMemo(
    () => Vec.zip(order, Characters.forPlayerCount(order.length)),
    [order]
  );

  return (
    <>
      <HeaderAndSteps synopsis="Give each player a player mat:">
        <>
          Find all <strong>{order.length}</strong> player mats with{" "}
          <strong>{order.length} player</strong> written in the top-right corner
          of the mat.
        </>
        <>
          Hand each player their character mat:
          <Stack direction="column" spacing={1} marginTop={1}>
            {Vec.map(playerCharacter, ([playerId, characterId]) => (
              <span key={playerId}>
                <PlayerAvatar playerId={playerId} inline />:{" "}
                <CharacterChip characterId={characterId} />
              </span>
            ))}
          </Stack>
        </>
        <>Place the mats face-up in front of each player.</>
      </HeaderAndSteps>
      <strong>IMPORTANT:</strong> Keep the back of the player mats hidden from
      other players.
    </>
  );
}

function InstanceCards({
  value: order,
  onClick,
}: InstanceCardsProps<readonly PlayerId[], readonly PlayerId[]>): JSX.Element {
  const playerCharacter = useMemo(
    () => Vec.zip(order, Characters.forPlayerCount(order.length)),
    [order]
  );

  return (
    <>
      {Vec.map(playerCharacter, ([playerId, characterId]) => (
        <InstanceCard
          key={playerId}
          onClick={onClick}
          title="Character"
          playerId={playerId}
        >
          <CharacterChip characterId={characterId} small />
        </InstanceCard>
      ))}
    </>
  );
}
