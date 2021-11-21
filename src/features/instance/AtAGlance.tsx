import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameStepsSelectorByType } from "features/game/gameSlice";
import { isTemplatable, Templatable } from "features/template/Templatable";
import { VariableGameStep } from "model/VariableGameStep";
import { InstanceCard } from "./InstanceCard";
import { instanceValuesSelector } from "./instanceSlice";
import {
  useOptionalInstanceValues,
  useRequiredInstanceValue,
} from "./useInstanceValue";

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
    <section>
      <Grid container columnSpacing={2} rowSpacing={3} marginY={3}>
        {Vec.map(components, ([step, value]) => (
          <InstanceCards
            key={step.id}
            // TODO: Fix the typing here
            step={step as unknown as VariableGameStep & Templatable}
          />
        ))}
      </Grid>
    </section>
  );
}

function InstanceCards({
  step,
}: {
  step: VariableGameStep & Templatable;
}): JSX.Element {
  const value = useRequiredInstanceValue(step);
  const depsValues = useOptionalInstanceValues(step.dependencies);

  const { InstanceCards } = step;

  return InstanceCards == null ? (
    <InDevelopmentMissingInstanceCard title={step.label} value={value} />
  ) : (
    <InstanceCards value={value} dependencies={depsValues} />
  );
}

function InDevelopmentMissingInstanceCard({
  title,
  value,
}: {
  title: string;
  value: unknown;
}): JSX.Element {
  return (
    <InstanceCard title={title}>
      <Typography variant="body2">{JSON.stringify(value)}</Typography>
    </InstanceCard>
  );
}
