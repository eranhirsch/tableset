import { List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameStepsSelectorByType } from "features/game/gameSlice";
import { isTemplatable } from "features/template/Templatable";
import { instanceValuesSelector } from "./instanceSlice";

export function AtAGlance(): JSX.Element {
  const templatableSteps = useAppSelector(
    gameStepsSelectorByType(isTemplatable)
  );
  const instancedSteps = useAppSelector(
    instanceValuesSelector(templatableSteps)
  );
  const components = Vec.filter(
    instancedSteps,
    ([{ isVariant }]) => !isVariant
  );

  return (
    <List
      dense
      subheader={<ListSubheader disableGutters>At A Glance</ListSubheader>}
    >
      {Vec.map(components, ([step, value]) => (
        <ListItem disableGutters key={step.id}>
          <ListItemText secondary={JSON.stringify(value)}>
            {step.label}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
