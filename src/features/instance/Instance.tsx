import { List, ListItem } from "@material-ui/core";
import { useAppSelector } from "../../app/hooks";
import { SetupStepName } from "../../games/concordia/ConcordiaGame";
import { selectors } from "./instanceSlice";

function InstanceItem({ stepId }: { stepId: SetupStepName }) {
  return <ListItem>Hello World</ListItem>;
}

export default function Instance() {
  const stepIds = useAppSelector(selectors.selectIds);

  return (
    <List component="ol">
      {stepIds.map((stepId) => (
        <InstanceItem stepId={stepId as SetupStepName} />
      ))}
    </List>
  );
}
