import { Chip, Stack } from "@mui/material";
import { Random, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { Faction, FactionId, Factions } from "../utils/Factions";
import {
  factionPlayerMatIdPairs,
  factionPlayerMatPairs,
  playerAssignments,
} from "../utils/playerAssignments";
import { Mat, MatId, PlayerMats } from "../utils/PlayerMats";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

type PlayerPreference = { playerId: PlayerId } & (
  | { factionId: FactionId }
  | { matId: MatId }
);
type TemplateConfig = readonly Readonly<PlayerPreference>[];

export default createRandomGameStep({
  id: "playerAssignments",
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    factionsStep,
    playerMatsStep,
  ],

  isTemplatable: (_players, _products, factions, playerMats) =>
    factions.willResolve() || playerMats.willResolve(),

  resolve(config, playerIds, productIds, factionIds, matsHash) {
    if (matsHash == null && factionIds == null) {
      return null;
    }

    const pairs = factionPlayerMatIdPairs(
      playerIds!.length,
      matsHash,
      factionIds,
      productIds!
    );

    const byPreferences = pairs.reduce((ongoing, [factionId, matId]) => {
      const relevantPreferences = Vec.filter(
        config,
        ({ playerId }) => !ongoing.includes(playerId)
      );
      const fulfilledPreference = relevantPreferences.find(
        (preference) =>
          ("factionId" in preference && preference.factionId === factionId) ||
          ("matId" in preference && preference.matId === matId)
      );
      return Vec.concat(ongoing, fulfilledPreference?.playerId);
    }, [] as readonly (PlayerId | undefined)[]);

    const remaining = [...Random.shuffle(Vec.diff(playerIds!, byPreferences))];

    return Vec.map(byPreferences, (playerId) => playerId ?? remaining.pop());
  },

  initialConfig: (): Readonly<TemplateConfig> => [],

  refresh(config: Readonly<TemplateConfig>, players, products) {
    const playerIds = players.onlyResolvableValue()!;

    const productIds = products.onlyResolvableValue()!;
    const availableFactions = Factions.availableForProducts(productIds);
    const availableMats = PlayerMats.availableForProducts(productIds);

    const refreshed = Vec.filter(
      config,
      ({ playerId, ...pref }) =>
        playerIds.includes(playerId) &&
        (("factionId" in pref && availableFactions.includes(pref.factionId)) ||
          ("matId" in pref && availableMats.includes(pref.matId)))
    );
    return refreshed.length < config.length
      ? refreshed
      : templateValue("unchanged");
  },

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
  InstanceManualComponent,
});

function ConfigPanel({
  config,
  queries: [players, products, factions, mats],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[],
  string
>): JSX.Element {
  return <div>TODO</div>;
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  return <>TODO</>;
}

function InstanceVariableComponent({
  value: order,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const factionIds = useOptionalInstanceValue(factionsStep);
  const playerMatsIdx = useOptionalInstanceValue(playerMatsStep);

  const assignments = useMemo(
    () => playerAssignments(order, playerMatsIdx, factionIds, productIds),
    [factionIds, order, playerMatsIdx, productIds]
  );

  return (
    <>
      <BlockWithFootnotes
        footnote={
          <InstanceStepLink
            step={factionIds == null ? factionsStep : playerMatsStep}
          />
        }
      >
        {(Footnote) => (
          <>
            Players take their assigned{" "}
            {factionIds == null ? (
              <>
                player mat and the faction paired with that mat
                <Footnote />
              </>
            ) : playerMatsIdx == null ? (
              <>
                faction and the player mat paired with that faction
                <Footnote />
              </>
            ) : (
              "faction and player mat combo"
            )}
            :
          </>
        )}
      </BlockWithFootnotes>
      <Stack direction="column" spacing={1} padding={1}>
        {Vec.map_with_key(assignments, (playerId, [faction, mat]) => (
          <PlayerAssignment
            key={`${playerId}_assignment`}
            playerId={playerId}
            faction={faction}
            mat={mat}
          />
        ))}
      </Stack>
    </>
  );
}

function PlayerAssignment({
  playerId,
  faction,
  mat,
}: {
  playerId: PlayerId;
  faction: Faction | null;
  mat: Mat | null;
}): JSX.Element {
  return (
    <span>
      <PlayerAvatar playerId={playerId} inline />:{" "}
      {faction != null ? (
        <Chip
          color={faction.color}
          label={mat != null ? `${mat.name} ${faction.name}` : faction.name}
        />
      ) : (
        mat!.name
      )}
    </span>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const factionIds = useOptionalInstanceValue(factionsStep);
  const matsHash = useOptionalInstanceValue(playerMatsStep);
  const isModular = useRequiredInstanceValue(modularBoardVariant);

  const pairs = useMemo(
    () =>
      matsHash == null && factionIds == null
        ? null
        : factionPlayerMatPairs(
            playerIds.length,
            matsHash,
            factionIds,
            productIds
          ),
    [factionIds, matsHash, playerIds.length, productIds]
  );

  const generalInstructions = `Randomly assign a player board ${
    isModular ? "" : "and faction pairing"
  } to each player`;

  if (pairs == null) {
    return (
      <BlockWithFootnotes footnote={<InstanceStepLink step={playerMatsStep} />}>
        {(Footnote) => (
          <>
            {generalInstructions}
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
    );
  }

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <BlockWithFootnotes footnote={<InstanceStepLink step={playerMatsStep} />}>
        {(Footnote) => (
          <span>
            {generalInstructions}
            <Footnote />:
          </span>
        )}
      </BlockWithFootnotes>
      <Stack spacing={1} direction="column" textAlign="center">
        {React.Children.toArray(
          Vec.map(pairs, ([faction, mat]) =>
            faction == null ? (
              <span>
                <strong>{mat!.name}</strong>
                {!isModular && " and it's paired faction"}
              </span>
            ) : (
              <span>
                <Chip
                  color={faction.color}
                  label={
                    <>
                      {mat != null && <em>{mat.name} </em>}
                      {faction.name}
                    </>
                  }
                />
                {mat == null && " and it's paired player mat"}
              </span>
            )
          )
        )}
      </Stack>
    </Stack>
  );
}
