import { Grid, Typography } from "@mui/material";
import { $, Dict, ReactUtils, Vec } from "common";
import { isTemplatable, Templatable } from "features/template/Templatable";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";
import { InstanceCard } from "./InstanceCard";
import { useGameFromParam } from "./useGameFromParam";
import { useInstanceFromParam } from "./useInstanceFromParam";
import {
  useOptionalInstanceValues,
  useRequiredInstanceValue,
} from "./useInstanceValue";

export function AtAGlance(): JSX.Element {
  const game = useGameFromParam();
  const instance = useInstanceFromParam();

  console.log("INSTANCE", instance);

  const instancedSteps = useMemo(
    () =>
      $(
        game.steps,
        ($$) => Dict.filter($$, isTemplatable),
        ($$) => Dict.inner_join($$, instance),
        Vec.values
      ),
    [game.steps, instance]
  );

  const navigateToChild = ReactUtils.useNavigateToChild();

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
            onClick={() => navigateToChild(step.id)}
          />
        ))}
      </Grid>
    </section>
  );
}

function InstanceCards({
  step,
  onClick,
}: {
  step: VariableGameStep & Templatable;
  onClick(): void;
}): JSX.Element {
  const value = useRequiredInstanceValue(step);
  const depsValues = useOptionalInstanceValues(step.dependencies);

  const { InstanceCards } = step;

  return InstanceCards == null ? (
    <InDevelopmentMissingInstanceCard
      title={step.label}
      value={value}
      onClick={onClick}
    />
  ) : (
    <InstanceCards value={value} dependencies={depsValues} onClick={onClick} />
  );
}

function InDevelopmentMissingInstanceCard({
  title,
  value,
  onClick,
}: {
  title: string;
  value: unknown;
  onClick(): void;
}): JSX.Element {
  return (
    <InstanceCard title={title} onClick={onClick}>
      <Typography variant="body2">{JSON.stringify(value)}</Typography>
    </InstanceCard>
  );
}
