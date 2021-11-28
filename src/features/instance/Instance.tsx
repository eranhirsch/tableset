import HomeIcon from "@mui/icons-material/Home";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Fab } from "@mui/material";
import { TSPage } from "app/ux/Chrome";
import { ReactUtils } from "common";
import { AtAGlance } from "./AtAGlance";
import { TABLE_OF_CONTENTS_PATH } from "./TableOfContents";
import { useGameFromParam } from "./useGameFromParam";
import { VariantSummary } from "./VariantSummary";

export function Instance(): JSX.Element {
  const navigateToParent = ReactUtils.useNavigateToParent();
  const navigateToChild = ReactUtils.useNavigateToChild();

  const game = useGameFromParam();

  return (
    <TSPage
      title={`Table for ${game.name}`}
      buttons={[
        [<HomeIcon />, navigateToParent],
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
