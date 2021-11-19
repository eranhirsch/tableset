import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Vec } from "common";
import { gameStepsSelectorByType } from "features/game/gameSlice";
import { isTemplatable, Templatable } from "features/template/Templatable";
import { VariableGameStep } from "model/VariableGameStep";
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
      <Typography component="header" variant="h5">
        At a Glance
      </Typography>
      <Grid container spacing={1}>
        {Vec.map(components, ([step, value]) => (
          <Grid item component="article" key={step.id} xs={4}>
            <InstanceCard title={step.label}>
              <InstanceCardContents
                // TODO: Fix the typing here
                step={step as unknown as VariableGameStep & Templatable}
              />
            </InstanceCard>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}

function InstanceCardContents({
  step,
}: {
  step: VariableGameStep & Templatable;
}): JSX.Element {
  const value = useRequiredInstanceValue(step);
  const depsValues = useOptionalInstanceValues(step.dependencies);

  const { InstanceCardContents } = step;

  return InstanceCardContents == null ? (
    <Typography variant="body2">{JSON.stringify(value)}</Typography>
  ) : (
    <InstanceCardContents value={value} dependencies={depsValues} />
  );
}

function InstanceCard({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>): JSX.Element {
  return (
    <Card
      elevation={1}
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        aspectRatio: "2.5 / 3.5",
        padding: 1,
      }}
    >
      <CardHeader
        component="header"
        title={title}
        titleTypographyProps={{
          fontSize: "small",
        }}
        sx={{
          padding: 0,
          flex: "0 0 25%",
          alignItems: "flex-start",
        }}
      />
      <CardContent
        sx={{
          padding: 0,
          ":last-child": { paddingBottom: 0 },
          flex: "0 0 75%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}