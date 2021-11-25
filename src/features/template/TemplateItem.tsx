import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Collapse,
  IconButton,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  useTheme,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useFeaturesContext } from "features/useFeaturesContext";
import React from "react";
import { StepConfigPanelWrapper } from "./StepConfigPanelWrapper";
import { Templatable } from "./Templatable";
import {
  templateActions,
  templateElementSelectorNullable,
} from "./templateSlice";

export function TemplateItem({
  templatable,
  selected = false,
  onExpand,
  onCollapse,
}: {
  templatable: Templatable;
  selected?: boolean;
  onExpand(): void;
  onCollapse(): void;
}): JSX.Element {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const context = useFeaturesContext();

  const element = useAppSelector(templateElementSelectorNullable(templatable));

  if (element?.isStale) {
    // TODO: Actual loading visualization
    return <div>Loading...</div>;
  }

  return (
    <Paper
      sx={{
        marginY: selected ? 3 : 1,
        marginX: selected ? 0.5 : undefined,
        borderStyle: element == null ? "dashed" : undefined,
        borderWidth: element == null ? "2px" : undefined,
        borderRadius: 3,
        transition: theme.transitions.create("margin"),
      }}
      variant={element == null ? "outlined" : "elevation"}
      elevation={element == null ? undefined : selected ? 5 : 2}
    >
      <ListItemButton
        onClick={
          element != null
            ? selected
              ? onCollapse
              : onExpand
            : () => {
                onExpand();
                dispatch(templateActions.enabled(templatable, context));
              }
        }
      >
        <ListItemText
          primaryTypographyProps={{
            textAlign: element == null ? "center" : undefined,
            color: element == null ? "gray" : undefined,
          }}
          secondaryTypographyProps={{ sx: { marginInlineEnd: 5 } }}
          secondary={
            element == null ? undefined : (
              <templatable.ConfigPanelTLDR config={element.config} />
            )
          }
        >
          {element == null ? <em>{templatable.label}</em> : templatable.label}
        </ListItemText>
        {element != null && selected && (
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                onCollapse();
                dispatch(templateActions.disabled(templatable));
              }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItemButton>
      <Collapse in={element != null && selected} unmountOnExit>
        <Box padding={1}>
          <StepConfigPanelWrapper templatable={templatable} />
        </Box>
      </Collapse>
    </Paper>
  );
}

