import { Stack } from "@mui/material";
import { Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { Characters } from "../utils/Characters";
import { CharacterChip } from "../ux/CharacterChip";

export default createRandomGameStep({
  id: "playerMats",
  dependencies: [playersMetaStep],
  isTemplatable: () => true,

  resolve: (_, playerIds) => Random.shuffle(playerIds!),

  InstanceVariableComponent,
  InstanceManualComponent,
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
        <BlockWithFootnotes
          footnote={
            <>
              Each player count has a corresponding set of player mats,
              indicated by the number in the top right corner.
            </>
          }
        >
          {(Footnote) => (
            <>
              Gather all <strong>{order!.length}</strong> player mats
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
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
        <>Players place their mat portrait side up in front of them.</>
      </HeaderAndSteps>
      <strong>IMPORTANT:</strong> Keep the back of the player mats hidden from
      other players.
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  return (
    <>
      <HeaderAndSteps synopsis="Give each player a player mat:">
        <BlockWithFootnotes
          footnote={
            <>
              Each player count has a corresponding set of player mats,
              indicated by the number in the top right corner. For{" "}
              <strong>{playerIds.length}</strong> players those are:{" "}
              <GrammaticalList>
                {Vec.map(
                  Characters.forPlayerCount(playerIds.length),
                  (characterId) => (
                    <CharacterChip characterId={characterId} small />
                  )
                )}
              </GrammaticalList>
            </>
          }
        >
          {(Footnote) => (
            <>
              Gather all <strong>{playerIds.length}</strong> player mats
              <Footnote />.
            </>
          )}
        </BlockWithFootnotes>
        <>
          Set <strong>1</strong> player mat portrait side up in front of each
          player.
        </>
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
