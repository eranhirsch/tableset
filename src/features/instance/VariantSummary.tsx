import CheckIcon from "@mui/icons-material/Check";
import { Box, Chip, Collapse, Stack, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, Vec } from "common";
import { gameStepsSelector } from "features/game/gameSlice";
import { isTemplatable } from "features/template/Templatable";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { StepId } from "model/Game";
import { useMemo, useRef, useState } from "react";
import { instanceIntersectIdsSelector } from "./instanceSlice";

export function VariantSummary(): JSX.Element | null {
  const [expandedStepId, setExpandedStepId] = useState<StepId>();

  const allSteps = useAppSelector(gameStepsSelector);

  const variants = useMemo(
    () =>
      Dict.filter(
        Dict.filter(allSteps, isTemplatable),
        ({ isVariant }) => isVariant ?? false
      ),
    [allSteps]
  );

  const expandedElement = useRef<React.ReactNode>();
  if (expandedStepId != null) {
    // TODO: We need to pull this method into the templatable interface so that
    // we don't need awkward casts.
    const { InstanceVariableComponent } = variants[
      expandedStepId
    ] as RandomGameStep;
    expandedElement.current = <InstanceVariableComponent value={true} />;
  }

  const instanceValues = useAppSelector(
    instanceIntersectIdsSelector(Vec.keys(variants))
  );

  if (Dict.is_empty(variants)) {
    // No variants to show
    return null;
  }

  return (
    <Stack component="section" direction="column" paddingY={2}>
      <Box component="section" display="flex" gap={1} flexWrap="wrap">
        <Typography component="header" variant="overline">
          Variants:
        </Typography>
        {Vec.map_with_key(variants, (stepId, step) => (
          <Chip
            key={stepId}
            component="article"
            label={step.label}
            color={expandedStepId === stepId ? "secondary" : "primary"}
            icon={
              instanceValues.includes(stepId) ? (
                <CheckIcon fontSize="small" />
              ) : undefined
            }
            variant={instanceValues.includes(stepId) ? "filled" : "outlined"}
            onClick={() =>
              setExpandedStepId((current) =>
                current !== stepId ? stepId : undefined
              )
            }
          />
        ))}
      </Box>
      <Collapse component="section" in={expandedStepId != null} unmountOnExit>
        <Box paddingTop={1}>
          <Typography component="header" variant="caption">
            Description
          </Typography>
          {expandedElement.current}
        </Box>
      </Collapse>
    </Stack>
  );
}
