import { Fab, List } from "@material-ui/core";
import { useMemo, useState } from "react";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import ConcordiaGame from "../../games/concordia/ConcordiaGame";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectors as templateSelectors } from "./templateSlice";
import { selectors as playersSelectors } from "../players/playersSlice";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import instanceSlice from "../instance/instanceSlice";
import { Link as RouterLink } from "react-router-dom";
import { gameSelector } from "../game/gameSlice";

export default function Template() {
  const dispatch = useAppDispatch();
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const game = useAppSelector(gameSelector);
  const template = useAppSelector(templateSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds);

  const allItems = ConcordiaGame.order;
  const templatableItems = useMemo(
    () =>
      allItems.filter(
        (stepId) =>
          game.strategiesFor(stepId, template, playerIds.length).length > 1
      ),
    [allItems, game, playerIds.length, template]
  );

  return (
    <>
      <List component="ol">
        {templatableItems.map((stepId) => (
          <TemplateItem
            key={stepId}
            stepId={stepId}
            expanded={stepId === expandedStepId}
            onClick={(isExpanded) =>
              setExpandedStepId(isExpanded ? undefined : stepId)
            }
          />
        ))}
      </List>
      <Fab
        component={RouterLink}
        to="/instance"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        color="primary"
        aria-label="go"
        onClick={() => {
          dispatch(instanceSlice.actions.created(game, template, playerIds));
        }}
      >
        <PlayArrowIcon />
      </Fab>
    </>
  );
}
