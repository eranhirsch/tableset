import { Typography } from "@mui/material";
import { useFeaturesContext } from "features/useFeaturesContext";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { DerivedGameStep } from "model/DerivedGameStep";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function InstanceItemContent({
  gameStep,
}: {
  gameStep: RandomGameStep | DerivedGameStep;
}): JSX.Element | null {
  const instance = useInstanceFromParam();

  const context = useFeaturesContext();
  const { InstanceManualComponent } = gameStep;
  if ("InstanceDerivedComponent" in gameStep) {
    return (
      <gameStep.InstanceDerivedComponent context={{ ...context, instance }} />
    );
  }
  const value = instance[gameStep.id];
  if (value != null) {
    return <gameStep.InstanceVariableComponent value={value} />;
  }
  if (InstanceManualComponent != null) {
    if (typeof InstanceManualComponent === "string") {
      // We allow simple strings as components too, in those cases we just
      // insert them into a basic component instead
      return <Typography variant="body1">{InstanceManualComponent}</Typography>;
    }
    return <InstanceManualComponent />;
  }
  // TODO: Kill this, make InstanceManualComponent non nullable
  return <div>Manual Section</div>;
}
