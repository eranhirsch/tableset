import DeleteIcon from "@mui/icons-material/Delete";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import {
  Box,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { Dict, Random, tuple, Vec } from "common";
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
import React, { useCallback, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { ScytheProductId } from "../ScytheProductId";
import { Faction, FactionId, Factions } from "../utils/Factions";
import {
  factionPlayerMatIdPairs,
  factionPlayerMatPairs,
  playerAssignments,
} from "../utils/playerAssignments";
import { Mat, MatId, PlayerMats } from "../utils/PlayerMats";
import { FactionChip } from "../ux/FactionChip";
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
  queries: [players, products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[],
  string
>): JSX.Element {
  const onDragEnd = useCallback(
    ({ reason, destination, draggableId, source }: DropResult) => {
      if (reason === "CANCEL") {
        return;
      }

      if (destination == null) {
        return;
      }

      const destIdx = destination.index;
      const sourceIdx = source.index;

      onChange((current) => {
        const filtered = Vec.filter(current, (_, i) => i !== sourceIdx);
        return Vec.concat(
          Vec.take(filtered, destIdx),
          current[sourceIdx],
          Vec.drop(filtered, destIdx)
        );
      });
    },
    [onChange]
  );

  return (
    <Stack direction="column" spacing={1}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="preferences" direction="vertical">
          {(droppableProvided) => (
            <List
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {Vec.map(config, (preference, index) => (
                <PreferenceListItem
                  key={`${preference.playerId}_${
                    "factionId" in preference
                      ? preference.factionId
                      : preference.matId
                  }`}
                  preference={preference}
                  index={index}
                  withDrag={config.length > 2}
                  onDelete={() =>
                    onChange((current) =>
                      Vec.filter(current, (_, idx) => idx !== index)
                    )
                  }
                />
              ))}
              {droppableProvided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <NewPreferencePanel
        playerIds={players.onlyResolvableValue()!}
        productIds={products.onlyResolvableValue()!}
        currentPreferences={config}
        onNewPreference={(preference) =>
          onChange((current) => Vec.concat(current, preference))
        }
      />
    </Stack>
  );
}

function PreferenceListItem({
  preference,
  index,
  withDrag,
  onDelete,
}: {
  preference: Readonly<PlayerPreference>;
  index: number;
  withDrag: boolean;
  onDelete(): void;
}): JSX.Element {
  return (
    <Draggable
      isDragDisabled={!withDrag}
      draggableId={`${preference.playerId}_${
        "factionId" in preference ? preference.factionId : preference.matId
      }`}
      index={index}
    >
      {(draggableProvided) => (
        <ListItem
          dense
          divider
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          secondaryAction={
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemIcon
            sx={{ flexGrow: 0 }}
            {...draggableProvided.dragHandleProps}
          >
            <DragHandleIcon />
          </ListItemIcon>
          <ListItemAvatar>
            <PlayerAvatar playerId={preference.playerId} inline />
          </ListItemAvatar>
          <ListItemText
            primary={
              "factionId" in preference ? (
                <FactionChip factionId={preference.factionId} />
              ) : (
                <Chip
                  size="small"
                  variant="outlined"
                  label={<em>{PlayerMats[preference.matId].name}</em>}
                />
              )
            }
          />
        </ListItem>
      )}
    </Draggable>
  );
}

function NewPreferencePanel({
  playerIds,
  productIds,
  currentPreferences,
  onNewPreference,
}: {
  playerIds: readonly PlayerId[];
  productIds: readonly ScytheProductId[];
  currentPreferences: Readonly<TemplateConfig>;
  onNewPreference(preference: PlayerPreference): void;
}): JSX.Element {
  const [showNewButton, setShowNewButton] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId>();
  const [selectedType, setSelectedType] = useState<"faction" | "mat">();

  const availableFactions = useMemo(
    () => Factions.availableForProducts(productIds),
    [productIds]
  );
  const availableMats = useMemo(
    () => PlayerMats.availableForProducts(productIds),
    [productIds]
  );

  const groupedBy = useMemo(
    () => Dict.group_by(currentPreferences, ({ playerId }) => playerId),
    [currentPreferences]
  );

  const notPreferredByPlayer = useMemo(
    () =>
      Dict.map(
        // We don't store players without preferences at all, so we need to map
        // the players and assign the empty list for them in those cases.
        Dict.from_keys(playerIds, (playerId) => groupedBy[playerId] ?? []),
        (preferences) =>
          // Find which items are NOT part of hte player's preferences yet
          tuple(
            Vec.diff(
              availableFactions,
              Vec.maybe_map(preferences, (preference) =>
                "factionId" in preference ? preference.factionId : undefined
              )
            ),
            Vec.diff(
              availableMats,
              Vec.maybe_map(preferences, (preference) =>
                "matId" in preference ? preference.matId : undefined
              )
            )
          )
      ),
    [availableFactions, availableMats, groupedBy, playerIds]
  );

  if (selectedType != null && selectedPlayerId != null) {
    let chips: readonly JSX.Element[];
    switch (selectedType) {
      case "faction":
        chips = Vec.map(
          notPreferredByPlayer[selectedPlayerId][0],
          (factionId) => (
            <FactionChip
              key={`${selectedPlayerId}_${factionId}`}
              factionId={factionId}
              onClick={() => {
                onNewPreference({
                  playerId: selectedPlayerId,
                  factionId,
                });
                setShowNewButton(true);
                setSelectedPlayerId(undefined);
                setSelectedType(undefined);
              }}
            />
          )
        );
        break;

      case "mat":
        chips = Vec.map(notPreferredByPlayer[selectedPlayerId][1], (matId) => (
          <Chip
            key={`${selectedPlayerId}_${matId}`}
            size="small"
            label={PlayerMats[matId].name}
            onClick={() => {
              onNewPreference({ playerId: selectedPlayerId, matId });
              setShowNewButton(true);
              setSelectedPlayerId(undefined);
              setSelectedType(undefined);
            }}
          />
        ));
        break;
    }

    return (
      <Box
        display="flex"
        flexWrap="wrap"
        gap={0.5}
        justifyContent="center"
        paddingX={3}
        paddingBottom={2}
      >
        {chips}
      </Box>
    );
  }

  if (selectedPlayerId != null) {
    // We need a type
    return (
      <Box display="flex" justifyContent="space-evenly" paddingBottom={2}>
        <Button
          disabled={Vec.is_empty(notPreferredByPlayer[selectedPlayerId][0])}
          size="small"
          variant="outlined"
          onClick={() => setSelectedType("faction")}
        >
          Faction
        </Button>
        <Button
          disabled={Vec.is_empty(notPreferredByPlayer[selectedPlayerId][1])}
          size="small"
          variant="outlined"
          onClick={() => setSelectedType("mat")}
        >
          Player Mat
        </Button>
      </Box>
    );
  }

  if (!showNewButton) {
    // we need a player
    return (
      <Box display="flex" justifyContent="center" gap={1} paddingBottom={2}>
        {Vec.maybe_map_with_key(
          notPreferredByPlayer,
          (playerId, [factions, mats]) =>
            Vec.is_empty(factions) && Vec.is_empty(mats) ? undefined : (
              <PlayerAvatar
                key={playerId}
                playerId={playerId}
                onClick={() => setSelectedPlayerId(playerId)}
              />
            )
        )}
      </Box>
    );
  }

  return (
    <Box paddingBottom={2} alignSelf="center">
      <Button
        size="small"
        variant="text"
        onClick={() => setShowNewButton(false)}
        sx={{ flexGrow: 0 }}
      >
        + New Player Preference
      </Button>
    </Box>
  );
}

function ConfigPanelTLDR({
  config,
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  return <>Random{!Vec.is_empty(config) && " (with player preferences)"}</>;
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
