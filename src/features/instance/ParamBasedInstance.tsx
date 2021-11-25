import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Fab } from "@mui/material";
import { TSPage } from "app/ux/Chrome";
import { nullthrows, ReactUtils } from "common";
import { GameId, GAMES } from "games/core/GAMES";
import { Link, useLocation, useParams } from "react-router-dom";
import { AtAGlanceFromParam } from "./AtAGlance";
import { TABLE_OF_CONTENTS_PATH } from "./TableOfContents";
import { VariantSummaryFromParams } from "./VariantSummary";

export function ParamBasedInstance(): JSX.Element {
  const { gameId } = useParams();
  const location = useLocation();

  const game = nullthrows(GAMES[nullthrows(gameId) as GameId]);

  return (
    <TSPage
      title={`Table for ${game.name}`}
      buttons={[
        [<HomeIcon />, `/${gameId}`],
        [<TuneIcon />, "/template"],
      ]}
    >
      <Box
        sx={{
          maxHeight: "100%",
          paddingBottom: 10,
          ...ReactUtils.SX_SCROLL_WITHOUT_SCROLLBARS,
        }}
      >
        <VariantSummaryFromParams />
        <AtAGlanceFromParam />
      </Box>
      <Fab
        component={Link}
        to={
          location.pathname.endsWith("/")
            ? TABLE_OF_CONTENTS_PATH
            : `${location.pathname}/${TABLE_OF_CONTENTS_PATH}`
        }
        sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 999 }}
        color="primary"
        aria-label="go"
      >
        <PlayArrowIcon />
      </Fab>
    </TSPage>
  );
}
