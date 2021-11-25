import { Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { RandomGameStep } from "games/core/steps/createRandomGameStep";
import { DerivedGameStep } from "model/DerivedGameStep";
import { StepId } from "model/Game";
import { useMemo } from "react";
import { instanceSelectors, SetupStep } from "./instanceSlice";
import { useInstanceFromParam } from "./useInstanceFromParam";

export function InstanceItemContent({
  gameStep,
}: {
  gameStep: RandomGameStep | DerivedGameStep;
}): JSX.Element | null {
  const instanceFromParam = useInstanceFromParam();
  const instanceFromParamDict = useMemo(
    () =>
      instanceFromParam == null
        ? null
        : Dict.map_with_key(instanceFromParam, (id, value) => ({ id, value })),
    [instanceFromParam]
  );

  let instance = useAppSelector(instanceSelectors.selectEntities);
  if (instanceFromParamDict != null) {
    instance = instanceFromParamDict;
  }

  const context = useFeaturesContext();
  const { InstanceManualComponent } = gameStep;
  if ("InstanceDerivedComponent" in gameStep) {
    return (
      <gameStep.InstanceDerivedComponent
        context={{
          ...context,
          instance:
            // redux dictionaries are really weird because they support ID types
            // which aren't used, and have undefined as part of the value.
            // We cast here to work around it...
            Vec.values(instance as Record<StepId, SetupStep>),
        }}
      />
    );
  }
  const instanceStep = instance[gameStep.id];
  if (instanceStep != null) {
    return <gameStep.InstanceVariableComponent value={instanceStep.value} />;
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
