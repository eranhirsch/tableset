import CheckIcon from "@mui/icons-material/Check";
import { Box, Chip, Collapse, Stack, Typography } from "@mui/material";
import { Dict, Vec } from "common";
import { isTemplatable } from "features/template/Templatable";
import { useMemo, useRef, useState } from "react";
import { StepId } from "./Game";
import { useGameFromParam } from "./useGameFromParam";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function VariantSummary(): JSX.Element | null {
  const game = useGameFromParam();
  const instance = useInstanceFromParam();

  const variants = useMemo(
    () =>
      Dict.filter(
        Dict.filter(game.steps, isTemplatable),
        ({ isVariant }) => isVariant ?? false
      ),
    [game.steps]
  );

  const instanceValues = useMemo(
    () => Vec.keys(Dict.inner_join(variants, instance)),
    [instance, variants]
  );

  const [expandedStepId, setExpandedStepId] = useState<StepId>();

  const expandedElement = useRef<React.ReactNode>();
  if (expandedStepId != null) {
    // TODO: We need to pull this method into the templatable interface so that
    // we don't need awkward casts.
    const { InstanceVariableComponent } = variants[expandedStepId];
    expandedElement.current = <InstanceVariableComponent value={true} />;
  }

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
