import { AvatarGroup, Box, Typography } from "@mui/material";
import { ConfigPanelProps } from "features/template/Templatable";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { PlayerAvatar } from "../../../features/players/PlayerAvatar";
import { firstPlayerIdSelector } from "../../../features/players/playersSlice";
import { PlayerId } from "../../../model/Player";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";

export default createRandomGameStep({
  id: "playOrder",
  labelOverride: "Seating",

  dependencies: [playersMetaStep],

  isType: (x): x is PlayerId[] =>
    Array.isArray(x) && x.every((y) => typeof y === "string"),

  InstanceVariableComponent,
  InstanceManualComponent,

  // TODO: Move to the resolver
  // random: (playerIds) =>
  //   // We slice the first player because it acts as a pivot
  //   Vec.shuffle(playerIds.slice(1)),

  isTemplatable: (players) =>
    players.count({
      // It's meaningless to talk about order with less than 3 players
      min: 3,
    }),

  resolve: (config: readonly PlayerId[], playerIds) => config,

  initialConfig: (players) => players.resolve().slice(1),

  refresh(current: readonly PlayerId[], players) {
    const playerIds = players.resolve();
    // Remove any deleted players from the current value.
    let currentRefreshed = current.filter((playerId) =>
      playerIds.includes(playerId)
    );

    const [newPivot, ...rest] = playerIds;

    const newPivotIdx = currentRefreshed.indexOf(newPivot);
    if (newPivotIdx > -1) {
      // the current value can contain the pivot only if the previous pivot
      // was removed so we need to re-pivot the current array

      currentRefreshed = currentRefreshed
        // First take all players after the new pivot
        .slice(newPivotIdx + 1)
        // Then add the players who were previously before the new pivot
        .concat(currentRefreshed.slice(0, newPivotIdx));
    }

    const missing = rest.filter((playerId) => !current.includes(playerId));
    return currentRefreshed.concat(missing);
  },

  ConfigPanel,
});

function ConfigPanel({
  config,
  queries,
  onChange,
}: ConfigPanelProps<readonly PlayerId[], readonly PlayerId[]>): JSX.Element {
  return <div>Hello World</div>;
}

function InstanceVariableComponent({
  value: playOrder,
}: VariableStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const firstPlayerId = useAppSelector(firstPlayerIdSelector);

  return (
    <>
      <Typography variant="body1">
        Sit players clockwise around the table in the following order:
      </Typography>
      <Box display="flex" component="figure">
        <AvatarGroup>
          <PlayerAvatar playerId={firstPlayerId} />
          {React.Children.toArray(
            playOrder.map((playerId) => <PlayerAvatar playerId={playerId} />)
          )}
        </AvatarGroup>
      </Box>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <>
          Players would play in <strong>clockwise</strong> order around the
          table.
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Choose a seat around the table for each player
          <Footnote index={1} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}

// function TemplateLabel({ value }: { value: readonly PlayerId[] }): JSX.Element {
//   const firstPlayerId = useAppSelector(firstPlayerIdSelector);
//   return (
//     <>
//       {React.Children.toArray(
//         [firstPlayerId].concat(value).map((playerId, idx) => (
//           <>
//             <PlayerShortName playerId={playerId} />
//             {idx < value.length && (
//               <NavigateNextIcon
//                 fontSize="small"
//                 sx={{ verticalAlign: "middle" }}
//               />
//             )}
//           </>
//         ))
//       )}
//     </>
//   );
// }

// function Selector({
//   current: order,
// }: {
//   current: readonly PlayerId[];
// }): JSX.Element {
//   const onDragEnd = useCallback(
//     ({ reason, source, destination }: DropResult) => {
//       if (reason === "CANCEL") {
//         return;
//       }

//       if (destination == null) {
//         // Dropped out of the droppable
//         return;
//       }

//       const value = moveItem(order, source.index, destination.index);
//       console.log(value); // TODO: just to make the variable used
//       // TODO: Modernize to ConfigPanel
//       // dispatch(
//       //   templateActions.constantValueChanged({
//       //     id: "playOrder",
//       //     value,
//       //   })
//       // );
//     },
//     [order]
//   );

//   return (
//     <Stack alignItems="center" direction="column" spacing={1}>
//       <Stack direction="row" spacing={1}>
//         <FirstAvatar />
//         <DragDropContext onDragEnd={onDragEnd}>
//           <Droppable droppableId="order" direction="horizontal">
//             {(provided) => (
//               <Stack
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 component="ol"
//                 direction="row"
//                 sx={{ padding: 0 }}
//                 spacing={1}
//               >
//                 {order.map((playerId, idx) => (
//                   <DraggablePlayer
//                     key={playerId}
//                     playerId={playerId}
//                     index={idx}
//                   />
//                 ))}
//                 {provided.placeholder}
//               </Stack>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </Stack>
//       <Typography variant="caption">{"In clockwise order"}</Typography>
//     </Stack>
//   );
// }

// function moveItem<T>(
//   items: readonly T[],
//   itemIdx: number,
//   targetIdx: number
// ): T[] {
//   const clone = items.slice();
//   const [item] = clone.splice(itemIdx, 1);
//   clone.splice(targetIdx, 0, item);
//   return clone;
// }

// function DraggablePlayer({
//   playerId,
//   index,
// }: {
//   playerId: PlayerId;
//   index: number;
//   badgeContent?: string;
// }) {
//   return (
//     <Draggable draggableId={`${playerId}`} index={index}>
//       {(provided) => (
//         <Avatar
//           component="li"
//           ref={provided.innerRef}
//           {...provided.dragHandleProps}
//           {...provided.draggableProps}
//         >
//           <PlayerNameShortAbbreviation playerId={playerId} />
//         </Avatar>
//       )}
//     </Draggable>
//   );
// }

// function FirstAvatar() {
//   const playerId = useAppSelector(firstPlayerIdSelector);
//   return (
//     <Badge
//       anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
//       overlap="circular"
//       badgeContent={<LockIcon color="primary" fontSize="small" />}
//     >
//       <PlayerAvatar playerId={playerId} />
//     </Badge>
//   );
// }
