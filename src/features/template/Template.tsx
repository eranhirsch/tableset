import { Fab, List } from "@material-ui/core";
import { useMemo, useState } from "react";
import TemplateItem from "./TemplateItem";
import { EntityId } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { templateSelectors } from "./templateSlice";
import { PlayerId, playersSelectors } from "../players/playersSlice";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import instanceSlice from "../instance/instanceSlice";
import { Link as RouterLink } from "react-router-dom";
import { gameSelector } from "../game/gameSlice";

export default function Template(): JSX.Element | null {
  const dispatch = useAppDispatch();
  const [expandedStepId, setExpandedStepId] = useState<EntityId>();

  const game = useAppSelector(gameSelector);
  const template = useAppSelector(templateSelectors.selectEntities);
  const playerIds = useAppSelector(playersSelectors.selectIds) as PlayerId[];

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
