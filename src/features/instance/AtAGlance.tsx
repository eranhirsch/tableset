import { Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
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
    <section>
      <Typography component="header" variant="h5">
        At a Glance
      </Typography>
      <Grid container spacing={1}>
        {Vec.map(components, ([step, value]) => (
          <Grid item component="article" key={step.id} xs={4}>
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
                title={step.label}
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
                <Typography variant="body1">{JSON.stringify(value)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </section>
  );
}
