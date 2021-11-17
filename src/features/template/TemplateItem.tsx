import {
  Collapse,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Switch,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { useFeaturesContext } from "features/useFeaturesContext";
import React, { ChangeEvent, useCallback } from "react";
import { StepConfigPanelWrapper } from "./StepConfigPanelWrapper";
import { Templatable } from "./Templatable";
import {
  templateActions,
  TemplateElement,
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
  const dispatch = useAppDispatch();

  const context = useFeaturesContext();

  const element = useAppSelector(templateElementSelectorNullable(templatable));

  const onChange = useCallback(
    (_: ChangeEvent, checked: boolean) => {
      if (checked) {
        onExpand();
        dispatch(templateActions.enabled(templatable, context));
      } else {
        onCollapse();
        dispatch(templateActions.disabled(templatable));
      }
    },
    [context, dispatch, onCollapse, onExpand, templatable]
  );

  if (element?.isStale) {
    // TODO: Actual loading visualization
    return <div>Loading...</div>;
  }

  return (
    <Paper
      sx={{
        marginY: 1,
        borderStyle: element == null ? "dashed" : undefined,
        borderWidth: element == null ? "2px" : undefined,
      }}
      variant={element == null ? "outlined" : "elevation"}
      elevation={element == null ? undefined : selected ? 3 : 1}
    >
      <ListItemButton
        onClick={
          element != null ? (selected ? onCollapse : onExpand) : undefined
        }
      >
        <ListItemText
          primaryTypographyProps={{
            color: element == null ? "gray" : undefined,
          }}
          secondaryTypographyProps={{ sx: { marginInlineEnd: 5 } }}
          secondary={
            element == null ? undefined : (
              <ItemLabel templatable={templatable} element={element} />
            )
          }
        >
          {templatable.label}
        </ListItemText>
        <ListItemSecondaryAction>
          <Switch edge="end" checked={element != null} onChange={onChange} />
        </ListItemSecondaryAction>
      </ListItemButton>
      <Collapse in={element != null && selected} unmountOnExit>
        <StepConfigPanelWrapper templatable={templatable} />
      </Collapse>
    </Paper>
  );
}

const ItemLabel = React.memo(
  ({
    templatable: { ConfigPanelTLDR, disabledTLDROverride },
    element,
  }: {
    templatable: Templatable;
    element: TemplateElement | undefined;
  }): JSX.Element | null =>
    element == null ? (
      <>{disabledTLDROverride ?? "Disabled"}</>
    ) : (
      <ConfigPanelTLDR config={element.config} />
    )
);
