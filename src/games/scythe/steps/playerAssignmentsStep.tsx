import ClearIcon from "@mui/icons-material/Clear";
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
  ListSubheader,
  Stack
} from "@mui/material";
import { C, Dict, Random, tuple, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { templateValue } from "features/template/templateSlice";
import {
  ConfigPanelProps,
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
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
import { ScytheStepId } from "../ScytheStepId";
import { Combos } from "../utils/Combos";
import { Faction, FactionId, Factions } from "../utils/Factions";
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
  id: ScytheStepId.FACTION_ASSIGNMENTS,
  dependencies: [
    playersMetaStep,
    productsMetaStep,
    factionsStep,
    playerMatsStep,
  ],

  isType: (x: unknown): x is readonly PlayerId[] =>
    Array.isArray(x) && (x.length === 0 || typeof x[0] === "string"),

  isTemplatable: (_players, _products, factions, playerMats) =>
    factions.willResolve() || playerMats.willResolve(),

  initialConfig: [],
  resolve,
  refresh,

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
  InstanceManualComponent,

  InstanceCards,

  instanceAvroType: { type: "array", items: "string" },
});

function resolve(
  config: Readonly<TemplateConfig>,
  playerIds: readonly PlayerId[] | null,
  productIds: readonly ScytheProductId[] | null,
  factionIds: readonly FactionId[] | null,
  matsHash: number
): readonly PlayerId[] | null {
  if (matsHash == null && factionIds == null) {
    return null;
  }

  const combos = Combos.ids(
    playerIds!.length,
    matsHash,
    factionIds,
    productIds!
  );

  // We scan the preferences in order, as the first one has the highest
  // priority
  const byPreferences = config.reduce(
    (assigned, { playerId, ...preference }) => {
      if (assigned.includes(playerId)) {
        // Skip players who have already been assigned a combo by a previous
        // preference.
        return assigned;
      }

      // We look for a combo that this preference matches
      const matchingComboIdx = combos.findIndex(
        ([factionId, matId], index) =>
          // It's not already assigned to a different player because of a
          // previous preference...
          assigned[index] == null &&
          // ...And that either it's faction or mat match the preference.
          ("factionId" in preference
            ? factionId === preference.factionId
            : matId === preference.matId)
      );

      if (matchingComboIdx === -1) {
        // If nothing matches we just skip to the next preference
        return assigned;
      }

      // If we have a match we assign the player to that combo by adding their
      // playerId to the array in the position that is relevant to this combo
      return Vec.concat(
        Vec.take(assigned, matchingComboIdx),
        playerId,
        Vec.drop(assigned, matchingComboIdx + 1)
      );
    },
    Vec.fill(combos.length, null as PlayerId | null)
  );

  const remaining = [...Random.shuffle(Vec.diff(playerIds!, byPreferences))];

  return Vec.map(byPreferences, (playerId) => playerId ?? remaining.pop()!);
}

function refresh(
  config: Readonly<TemplateConfig>,
  players: Query<readonly PlayerId[]>,
  products: Query<readonly ScytheProductId[]>,
  factions: Query<readonly FactionId[]>,
  playerMats: Query<number>
) {
  const playerIds = players.onlyResolvableValue()!;

  const productIds = products.onlyResolvableValue()!;
  const availableFactions = factions.willResolve()
    ? Factions.availableForProducts(productIds)
    : [];
  const availableMats = playerMats.willResolve()
    ? PlayerMats.availableForProducts(productIds)
    : [];

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
}

function ConfigPanel({
  config,
  queries: [players, products, factions, playerMats],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[],
  number
>): JSX.Element {
  const onDragEnd = useCallback(
    ({ reason, destination, source }: DropResult) => {
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
      {!Vec.is_empty(config) && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="preferences" direction="vertical">
            {(droppableProvided) => (
              <List
                ref={droppableProvided.innerRef}
                subheader={
                  !Vec.is_empty(config) ? (
                    <ListSubheader>
                      Preferences{config.length > 1 && " (ordered by priority)"}
                    </ListSubheader>
                  ) : undefined
                }
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
                    withDivider={index < config.length - 1}
                    withDrag={config.length >= 2}
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
      )}
      <NewPreferencePanel
        playerIds={players.onlyResolvableValue()!}
        productIds={products.onlyResolvableValue()!}
        types={Vec.filter_nulls([
          factions.willResolve() ? "faction" : null,
          playerMats.willResolve() ? "mat" : null,
        ])}
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
  withDivider,
  onDelete,
}: {
  preference: Readonly<PlayerPreference>;
  index: number;
  withDrag: boolean;
  withDivider: boolean;
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
          divider={withDivider}
          ref={draggableProvided.innerRef}
          secondaryAction={
            withDrag && <DragHandleIcon color="action" fontSize="small" />
          }
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
        >
          <ListItemIcon sx={{ flexGrow: 0 }}>
            <IconButton onClick={onDelete}>
              <ClearIcon color="action" fontSize="small" />
            </IconButton>
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
  types,
}: {
  playerIds: readonly PlayerId[];
  productIds: readonly ScytheProductId[];
  currentPreferences: Readonly<TemplateConfig>;
  onNewPreference(preference: PlayerPreference): void;
  types: readonly ("faction" | "mat")[];
}): JSX.Element {
  const onlyType = types.length === 1 ? C.onlyx(types) : undefined;

  const [showNewButton, setShowNewButton] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId>();

  const [selectedType, setSelectedType] = useState(onlyType);

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
                setSelectedType(onlyType);
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
              setSelectedType(onlyType);
            }}
          />
        ));
        break;
    }

    return (
      <Box display="flex" flexWrap="wrap" gap={0.5} justifyContent="center">
        {chips}
      </Box>
    );
  }

  if (selectedPlayerId != null) {
    // We need a type
    return (
      <Box display="flex" justifyContent="space-evenly">
        <Button
          disabled={Vec.is_empty(notPreferredByPlayer[selectedPlayerId][0])}
          variant="outlined"
          onClick={() => setSelectedType("faction")}
        >
          Faction
        </Button>
        <Button
          disabled={Vec.is_empty(notPreferredByPlayer[selectedPlayerId][1])}
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
      <Box display="flex" justifyContent="center" gap={1}>
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
    <Box alignSelf="center">
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
  const isModular = useRequiredInstanceValue(modularBoardVariant);

  const assignments = useMemo(
    () =>
      Combos.objectsWithPlayers(order, playerMatsIdx, factionIds, productIds),
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
            {isModular ? (
              <>player mat</>
            ) : factionIds == null ? (
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
      <Stack direction="column" spacing={1} marginTop={1}>
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
          label={
            mat != null
              ? `${mat.name} ${faction.name.short}`
              : faction.name.full
          }
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
        : Combos.objects(playerIds.length, matsHash, factionIds, productIds),
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
                      {faction.name.short}
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

function InstanceCards({
  value: order,
  dependencies: [_playerIds, productIds, factionIds, playerMatsIdx],
  onClick,
}: InstanceCardsProps<
  readonly PlayerId[],
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[],
  number
>): JSX.Element {
  const assignments = useMemo(
    () =>
      Combos.objectsWithPlayers(order, playerMatsIdx, factionIds, productIds!),
    [factionIds, order, playerMatsIdx, productIds]
  );

  return (
    <>
      {Vec.map_with_key(assignments, (playerId, [faction, mat]) => (
        <InstanceCard
          key={playerId}
          playerId={playerId}
          title={
            faction != null
              ? mat != null
                ? "Faction Combo"
                : "Faction"
              : "Mat"
          }
          onClick={onClick}
        >
          <Chip
            variant={faction != null ? "filled" : "outlined"}
            color={faction != null ? faction.color : "primary"}
            label={
              faction != null ? (
                mat != null ? (
                  <>
                    <em>{mat.abbreviated}</em>{" "}
                    <strong>{faction.name.abbreviated}</strong>
                  </>
                ) : (
                  faction.name.short
                )
              ) : (
                mat!.name
              )
            }
          />
        </InstanceCard>
      ))}
    </>
  );
}
