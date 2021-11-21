import { Card, CardContent, CardHeader, Grid } from "@mui/material";

export function InstanceCard({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>): JSX.Element {
  return (
    <Grid item component="article" xs={4}>
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
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
}
