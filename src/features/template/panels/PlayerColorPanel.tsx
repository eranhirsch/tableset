import { Avatar, Badge, Collapse, Stack, useTheme } from "@material-ui/core";
import { EntityId } from "@reduxjs/toolkit";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import nullthrows from "../../../common/err/nullthrows";
import { availableItems } from "../../../core/games/concordia/SetupStep";
import { selectors as playersSelectors } from "../../players/playersSlice";
import templateSlice, { PlayerColors } from "../templateSlice";
import CheckIcon from "@material-ui/icons/Check";

export default function PlayerColorPanel({
  playerColors = {},
}: {
  playerColors: PlayerColors | undefined;
}) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const [activePlayer, setActivePlayer] = useState<EntityId>();

  const allColors = useMemo(
    () => nullthrows(availableItems("playerColor")),
    []
  );

  const players = useAppSelector(playersSelectors.selectEntities);

  const activePlayerColor =
    activePlayer != null ? playerColors[activePlayer] : null;

  const colorPlayers = Object.fromEntries(
    Object.entries(playerColors).map(([playerId, color]) => [color, playerId])
  );

  return (
    <Stack alignItems="center" direction="column" spacing={1}>
      <Stack sx={{ padding: 0 }} component="ul" direction="row" spacing={1}>
        {Object.entries(players).map(([playerId, player]) => {
          const playerColor = playerColors[playerId];
          const [first, last] = player!.name.split(" ");

          return (
            <Badge
              sx={{
                opacity:
                  activePlayer == null || activePlayer === playerId
                    ? 1.0
                    : 0.25,
              }}
              invisible={playerColor == null || activePlayer === playerId}
              component="li"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              badgeContent={
                activePlayer != null ? <CheckIcon fontSize="inherit" /> : " "
              }
              overlap="circular"
              color={playerColor}
            >
              <Avatar
                onClick={() =>
                  setActivePlayer((activePlayer) =>
                    activePlayer === playerId ? undefined : playerId
                  )
                }
              >
                {`${first[0]}${last[0]}`}
              </Avatar>
            </Badge>
          );
        })}
      </Stack>
      <Collapse in={activePlayer != null}>
        <Stack padding={0} component="ul" direction="row" spacing={1}>
          {allColors.map((colorLabel) => {
            const colorPlayer = colorPlayers[colorLabel];
            const nameParts = players[colorPlayer]?.name.split(" ");

            const color = theme.palette[colorLabel].main;

            return (
              <Avatar
                component="li"
                sx={{
                  color: theme.palette.getContrastText(color),
                  bgcolor: color,
                }}
                onClick={
                  (colorPlayer != null && colorPlayer !== activePlayer) ||
                  activePlayer == null
                    ? undefined
                    : () => {
                        const newColors = {
                          ...playerColors,
                        };
                        if (color === activePlayerColor) {
                          delete newColors[activePlayer];
                        } else {
                          newColors[activePlayer] = colorLabel;
                        }
                        dispatch(
                          templateSlice.actions.fixedValueSet({
                            stepId: "playerColor",
                            value: newColors,
                          })
                        );
                      }
                }
              >
                {activePlayerColor === colorLabel ? (
                  <CheckIcon />
                ) : nameParts != null ? (
                  `${nameParts[0][0]}${nameParts[1][0]}`
                ) : (
                  " "
                )}
              </Avatar>
            );
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
}
