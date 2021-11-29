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
import { $, Dict, Random, Vec } from "common";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
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
import { ProductId } from "model/Game";
import { GamePiecesColor } from "model/GamePiecesColor";
import { PlayerId } from "model/Player";
import { VariableGameStep } from "model/VariableGameStep";
import React, { useCallback, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { ColorFunction, LabelFunction, ProductsFunction } from "../types";
import alwaysOnMetaStep from "./alwaysOnMetaStep";
import playersMetaStep from "./playersMetaStep";

interface Options<ItemId extends string | number, Pid extends ProductId> {
  // Required
  itemsStep: VariableGameStep<readonly ItemId[]>;
  labelForId: LabelFunction<ItemId>;
  availableForProducts: ProductsFunction<ItemId, Pid>;
  categoryName: string;
  productsMetaStep: VariableGameStep<readonly Pid[]>;

  // Optional
  enabler?: VariableGameStep<boolean>;
  getColor?: ColorFunction<ItemId>;

  // Optional from RandomGameStep
  InstanceCards?(
    props: InstanceCardsProps<
      readonly PlayerId[],
      readonly PlayerId[],
      readonly Pid[],
      boolean,
      readonly ItemId[]
    >
  ): JSX.Element | null;
}

interface PlayerPreference<ItemId extends string | number> {
  playerId: PlayerId;
  itemId: ItemId;
}
type TemplateConfig<ItemId extends string | number> = readonly Readonly<
  PlayerPreference<ItemId>
>[];

function createPlayerAssignmentStep<
  ItemId extends string | number,
  Pid extends ProductId
>({
  availableForProducts,
  categoryName,
  enabler,
  getColor,
  itemsStep,
  labelForId,
  productsMetaStep,
  ...otherOptions
}: Options<ItemId, Pid>): VariableGameStep<readonly PlayerId[]> {
  return createRandomGameStep({
    id: `${itemsStep.id}Assignments`,
    dependencies: [
      playersMetaStep,
      productsMetaStep,
      enabler ?? alwaysOnMetaStep,
      itemsStep,
    ],
    isTemplatable: (_players, _products, enabler, itemsStep) =>
      enabler.canResolveTo(true) && itemsStep.willResolve(),
    initialConfig: [] as TemplateConfig<ItemId>,
    resolve,
    refresh,

    ConfigPanel: (
      props: ConfigPanelProps<
        TemplateConfig<ItemId>,
        readonly PlayerId[],
        readonly Pid[],
        boolean,
        readonly ItemId[]
      >
    ) => (
      <ConfigPanel
        {...props}
        labelForId={labelForId}
        getColor={getColor}
        availableForProducts={availableForProducts}
      />
    ),
    ConfigPanelTLDR,

    InstanceVariableComponent: (props) => (
      <InstanceVariableComponent
        {...props}
        itemsStep={itemsStep}
        labelForId={labelForId}
        categoryName={categoryName}
      />
    ),

    instanceAvroType: { type: "array", items: "string" },

    ...otherOptions,
  });
}
export default createPlayerAssignmentStep;

function resolve<ItemId extends string | number, Pid extends ProductId>(
  config: Readonly<TemplateConfig<ItemId>>,
  playerIds: readonly PlayerId[] | null,
  _productIds: readonly Pid[] | null,
  isEnabled: boolean | null,
  itemIds: readonly ItemId[] | null
): readonly PlayerId[] | null {
  if (!isEnabled) {
    return null;
  }

  if (itemIds == null) {
    return null;
  }

  // We scan the preferences in order, as the first one has the highest
  // priority
  const byPreferences = config.reduce(
    (assigned, { playerId, itemId: preferredItemId }) => {
      if (assigned.includes(playerId)) {
        // Skip players who have already been assigned a combo by a previous
        // preference.
        return assigned;
      }

      // We look for a combo that this preference matches
      const itemIdx = itemIds.findIndex(
        (itemId, index) =>
          // It's not already assigned to a different player because of a
          // previous preference...
          assigned[index] == null &&
          // ...And that either it's faction or mat match the preference.
          itemId === preferredItemId
      );

      if (itemIdx === -1) {
        // If nothing matches we just skip to the next preference
        return assigned;
      }

      // If we have a match we assign the player to that combo by adding their
      // playerId to the array in the position that is relevant to this combo
      return Vec.concat(
        Vec.take(assigned, itemIdx),
        playerId,
        Vec.drop(assigned, itemIdx + 1)
      );
    },
    Vec.fill(itemIds.length, null as PlayerId | null)
  );

  const remaining = [...Random.shuffle(Vec.diff(playerIds!, byPreferences))];

  return Vec.map(byPreferences, (playerId) => playerId ?? remaining.pop()!);
}

function refresh<ItemId extends string | number, Pid extends ProductId>(
  config: Readonly<TemplateConfig<ItemId>>,
  players: Query<readonly PlayerId[]>,
  _products: Query<readonly Pid[]>,
  _isEnabled: Query<boolean>,
  items: Query<readonly ItemId[]>
) {
  const playerIds = players.onlyResolvableValue()!;

  const refreshed = Vec.filter(
    config,
    ({ playerId, itemId }) =>
      playerIds.includes(playerId) &&
      // Notice that this isn't a trivial boolean check, we accept `undefined`
      // which is falsy and would have been rejected if the check wasn't
      // explicit
      items.willContain(itemId) !== false
  );
  return refreshed.length < config.length
    ? refreshed
    : templateValue("unchanged");
}

function ConfigPanel<ItemId extends string | number, Pid extends ProductId>({
  config,
  queries: [players, products, _isEnabled, _selectedItems],
  onChange,
  labelForId,
  availableForProducts,
  getColor,
}: ConfigPanelProps<
  TemplateConfig<ItemId>,
  readonly PlayerId[],
  readonly Pid[],
  boolean,
  readonly ItemId[]
> & {
  labelForId: LabelFunction<ItemId>;
  availableForProducts: ProductsFunction<ItemId, Pid>;
  getColor?: ColorFunction<ItemId>;
}): JSX.Element {
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
                {Vec.map(config, ({ playerId, itemId }, index) => (
                  <PreferenceListItem
                    key={`${playerId}_${itemId}`}
                    playerId={playerId}
                    itemId={itemId}
                    label={labelForId(itemId)}
                    color={getColor?.(itemId)}
                    index={index}
                    withDivider={index < config.length - 1}
                    withDrag={config.length >= 2}
                    onDelete={() =>
                      onChange((current) =>
                        Vec.filter(
                          current,
                          (preference) =>
                            preference.playerId !== playerId ||
                            preference.itemId !== itemId
                        )
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
        items={availableForProducts(products.onlyResolvableValue()!)}
        labelForId={labelForId}
        playerIds={players.onlyResolvableValue()!}
        currentPreferences={config}
        getColor={getColor}
        onNewPreference={(preference) =>
          onChange((current) => Vec.concat(current, preference))
        }
      />
    </Stack>
  );
}

function PreferenceListItem<ItemId extends string | number>({
  itemId,
  label,
  color,
  playerId,
  index,
  withDrag,
  withDivider,
  onDelete,
}: {
  itemId: ItemId;
  label: string;
  color?: GamePiecesColor;
  playerId: PlayerId;
  index: number;
  withDrag: boolean;
  withDivider: boolean;
  onDelete(): void;
}): JSX.Element {
  return (
    <Draggable
      isDragDisabled={!withDrag}
      draggableId={`${playerId}_${itemId}`}
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
            <PlayerAvatar playerId={playerId} inline />
          </ListItemAvatar>
          <ListItemText
            primary={<Chip color={color} size="small" label={label} />}
          />
        </ListItem>
      )}
    </Draggable>
  );
}

function NewPreferencePanel<ItemId extends string | number>({
  playerIds,
  currentPreferences,
  onNewPreference,
  items,
  labelForId,
  getColor,
}: {
  playerIds: readonly PlayerId[];
  currentPreferences: Readonly<TemplateConfig<ItemId>>;
  onNewPreference(preference: PlayerPreference<ItemId>): void;
  items: readonly ItemId[];
  labelForId: LabelFunction<ItemId>;
  getColor?: ColorFunction<ItemId>;
}): JSX.Element {
  const [showNewButton, setShowNewButton] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<PlayerId>();

  const notPreferredByPlayer = useMemo(
    () =>
      $(
        Dict.group_by(currentPreferences, ({ playerId }) => playerId),
        ($$) =>
          Dict.map($$, (preferences) =>
            Vec.map(preferences, ({ itemId }) => itemId)
          ),
        ($$) =>
          Dict.from_keys(playerIds, (playerId) =>
            Vec.diff(items, $$[playerId] ?? [])
          )
      ),
    [currentPreferences, items, playerIds]
  );

  if (selectedPlayerId != null) {
    return (
      <Box display="flex" flexWrap="wrap" gap={0.5} justifyContent="center">
        {Vec.map(notPreferredByPlayer[selectedPlayerId], (itemId) => (
          <Chip
            key={`assignmentItemOption_${selectedPlayerId}_${itemId}`}
            size="small"
            label={labelForId(itemId)}
            color={getColor != null ? getColor(itemId) : undefined}
            onClick={() => {
              onNewPreference({ playerId: selectedPlayerId, itemId });
              setShowNewButton(true);
              setSelectedPlayerId(undefined);
            }}
          />
        ))}
      </Box>
    );
  }

  if (!showNewButton) {
    // we need a player
    return (
      <Box display="flex" justifyContent="center" gap={1}>
        {Vec.maybe_map_with_key(notPreferredByPlayer, (playerId, itemIds) =>
          Vec.is_empty(itemIds) ? undefined : (
            <PlayerAvatar
              key={`assignmentItemOption_${playerId}`}
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

function ConfigPanelTLDR<ItemId extends string | number>({
  config,
}: {
  config: Readonly<TemplateConfig<ItemId>>;
}): JSX.Element {
  return <>Random{!Vec.is_empty(config) && " (with player preferences)"}</>;
}

function InstanceVariableComponent<ItemId extends string | number>({
  value: order,
  itemsStep,
  categoryName,
  labelForId,
  getColor,
}: VariableStepInstanceComponentProps<readonly PlayerId[]> & {
  itemsStep: VariableGameStep<readonly ItemId[]>;
  categoryName: string;
  labelForId: LabelFunction<ItemId>;
  getColor?: ColorFunction<ItemId>;
}): JSX.Element {
  const itemIds = useRequiredInstanceValue(itemsStep);

  return (
    <>
      <BlockWithFootnotes footnote={<InstanceStepLink step={itemsStep} />}>
        {(Footnote) => (
          <>
            Players take their assigned <em>{categoryName}</em>
            <Footnote />:
          </>
        )}
      </BlockWithFootnotes>
      <Stack direction="column" spacing={1} marginTop={1}>
        {React.Children.toArray(
          Vec.map(order, (playerId, index) => (
            <>
              <PlayerAvatar playerId={playerId} inline />:{" "}
              <Chip
                color={getColor != null ? getColor(itemIds[index]) : undefined}
                label={labelForId(itemIds[index])}
              />
            </>
          ))
        )}
      </Stack>
    </>
  );
}
