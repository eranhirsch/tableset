import { CircularProgress, Fab, List } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { EntityId } from "@reduxjs/toolkit";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import GameMapper from "../../games/core/GameMapper";
import { gameIdSelector } from "../game/gameSlice";
import instanceSlice from "../instance/instanceSlice";
import { PlayerId, playersSelectors } from "../players/playersSlice";
import TemplateItem from "./TemplateItem";
import templateSlice, {
  templateIsStaleSelector,
  templateSelectors,
} from "./templateSlice";

export default function Template(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const gameId = useAppSelector(gameIdSelector);
  const template = useAppSelector(templateSelectors.selectEntities);
  const isStale = useAppSelector(templateIsStaleSelector);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

  const game = GameMapper.forId(gameId);
  const allItems = game.steps;
  const templatableItems = useMemo(
    () =>
      allItems.filter((step) => {
        if (step.strategies == null) {
          return false;
        }
        return step.strategies({ template, playerIds }).length > 1;
      }),
    [allItems, playerIds, template]
  );

  useEffect(() => {
    if (isStale) {
      dispatch(templateSlice.actions.refresh(playerIds));
    }
  }, [dispatch, isStale, playerIds]);

  return (
    <>
      <List component="ol">
        {templatableItems.map((step) => (
          <TemplateItem
            key={step.id}
            stepId={step.id}
            expanded={step.id === expandedStepId}
            onClick={(isExpanded) =>
              setExpandedStepId(isExpanded ? undefined : step.id)
            }
          />
        ))}
      </List>
      <Fab
        disabled={isStale}
        component={RouterLink}
        to="/instance"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        color="primary"
        aria-label="go"
        onClick={() => {
          dispatch(instanceSlice.actions.created(game, template, playerIds));
        }}
      >
        {isStale ? <CircularProgress /> : <PlayArrowIcon />}
      </Fab>
    </>
  );
}
