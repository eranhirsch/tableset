import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress, Fab, List } from "@mui/material";
import { Dict, Vec } from "common";
import { allExpansionIdsSelector } from "features/expansions/expansionsSlice";
import { gameStepsSelector } from "features/game/gameSlice";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { ProductId, StepId } from "model/Game";
import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { PlayerId } from "../../model/Player";
import instanceSlice from "../instance/instanceSlice";
import { playersSelectors } from "../players/playersSlice";
import TemplateItem from "./TemplateItem";
import {
  fullTemplateSelector,
  templateActions,
  TemplateElement,
  templateIsStaleSelector,
  templateSelectors,
} from "./templateSlice";

export default function Template(): JSX.Element | null {
  const dispatch = useAppDispatch();

  const [expandedStepId, setExpandedStepId] = useState<StepId>();

  const allSteps = useAppSelector(gameStepsSelector);

  const template = useAppSelector(templateSelectors.selectEntities) as Readonly<
    Record<StepId, Readonly<TemplateElement>>
  >;
  const isStale = useAppSelector(templateIsStaleSelector);

  const fullTemplate = useAppSelector(fullTemplateSelector);
  useEffect(() => {
    console.log("TEMPLATE", Dict.sort_by_key(fullTemplate));
  }, [fullTemplate]);

  const playerIds = useAppSelector(
    playersSelectors.selectIds
  ) as readonly PlayerId[];
  const productIds = useAppSelector(
    allExpansionIdsSelector
  ) as readonly ProductId[];

  const allRandomSteps = allSteps.filter(
    (x): x is RandomGameStep =>
      (x as Partial<RandomGameStep>).strategies != null
  );
  const allStrategies = useMemo(
    () =>
      Dict.map(
        Dict.from_values(allRandomSteps, ({ id }) => id),
        ({ strategies }) => strategies({ template, playerIds, productIds })
      ),
    [allRandomSteps, playerIds, productIds, template]
  );

  // TODO: This should probably show a megaphone with more info and a button to
  // manually refresh the template once the user understands what happened.
  useEffect(() => {
    if (isStale) {
      dispatch(templateActions.refresh({ playerIds, productIds }));
    }
  }, [dispatch, isStale, playerIds, productIds]);

  return (
    <>
      <List component="ol">
        {Vec.map_with_key(
          Dict.filter(allStrategies, (strategies) => strategies.length > 1),
          (stepId) => (
            <TemplateItem
              key={stepId}
              stepId={stepId}
              expanded={stepId === expandedStepId}
              onClick={(isExpanded) =>
                setExpandedStepId(isExpanded ? undefined : stepId)
              }
            />
          )
        )}
      </List>
      <Fab
        disabled={isStale}
        component={RouterLink}
        to="/instance"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        color="primary"
        aria-label="go"
        onClick={() => {
          dispatch(
            instanceSlice.actions.created(
              allRandomSteps,
              template,
              playerIds,
              productIds
            )
          );
        }}
      >
        {isStale ? <CircularProgress /> : <PlayArrowIcon />}
      </Fab>
    </>
  );
}
