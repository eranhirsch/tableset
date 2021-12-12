import { Box, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "model/Player";

const AVATAR_SIZE = 28;

export function InstanceCard({
  title,
  subheader,
  playerId,
  onClick,
  children,
}: React.PropsWithChildren<{
  title: string;
  subheader?: string;
  playerId?: PlayerId;
  onClick(): void;
}>): JSX.Element {
  return (
    <Grid item component="article" xs={4} onClick={onClick}>
      <Card
        elevation={1}
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          aspectRatio: "2.5 / 3.5",
          padding: 0.5,
        }}
      >
        <CardHeader
          component="header"
          title={title}
          subheader={subheader}
          avatar={
            playerId != null ? (
              <PlayerAvatar
                sx={{ margin: 0 }}
                playerId={playerId}
                size={AVATAR_SIZE}
              />
            ) : (
              <Box display="block" width={AVATAR_SIZE} />
            )
          }
          titleTypographyProps={{
            fontSize: "small",
            lineHeight: `${AVATAR_SIZE / 2}px`,
          }}
          sx={{
            padding: 0,
            "> .MuiCardHeader-avatar": { marginRight: 0 },
            flex: "0 0 25%",
            flexDirection: "row-reverse",
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
            alignContent: "center",
          }}
        >
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
}
