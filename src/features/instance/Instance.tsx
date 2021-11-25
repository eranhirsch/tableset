import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Fab } from "@mui/material";
import { TSPage } from "app/ux/Chrome";
import { nullthrows, ReactUtils } from "common";
import { GameId, GAMES } from "games/core/GAMES";
import { useParams } from "react-router-dom";
import { AtAGlance } from "./AtAGlance";
import { TABLE_OF_CONTENTS_PATH } from "./TableOfContents";
import { VariantSummary } from "./VariantSummary";

export function Instance(): JSX.Element {
  const navigateToChild = ReactUtils.useNavigateToChild();
  const { gameId } = useParams();

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
        <VariantSummary />
        <AtAGlance />
      </Box>
      <Fab
        sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 999 }}
        color="primary"
        onClick={() => navigateToChild(TABLE_OF_CONTENTS_PATH)}
      >
        <PlayArrowIcon />
      </Fab>
    </TSPage>
  );
}
