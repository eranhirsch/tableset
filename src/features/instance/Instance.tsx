import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TuneIcon from "@mui/icons-material/Tune";
import { Box, Fab } from "@mui/material";
import { TSPage } from "app/ux/Chrome";
import { Dict, ReactUtils } from "common";
import { useGameHomeToolbarButton } from "features/game/useGameHomeToolbarButton";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { gameSelector } from "../game/gameSlice";
import { AtAGlance } from "./AtAGlance";
import { fullInstanceSelector } from "./instanceSlice";
import { TABLE_OF_CONTENTS_PATH } from "./MobileSetup";
import { VariantSummary } from "./VariantSummary";

export function Instance(): JSX.Element | null {
  const homeButton = useGameHomeToolbarButton();

  const game = useAppSelector(gameSelector);

  // Just for logging, dump the full instance, normalized
  const fullInstance = useAppSelector(fullInstanceSelector);
  useEffect(() => {
    console.log("INSTANCE", Dict.sort_by_key(fullInstance));
  }, [fullInstance]);

  return (
    <TSPage
      title={`Table for ${game.name}`}
      buttons={[homeButton, [<TuneIcon />, "/template"]]}
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
        component={Link}
        to={`/instance/${TABLE_OF_CONTENTS_PATH}`}
        sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 999 }}
        color="primary"
        aria-label="go"
      >
        <PlayArrowIcon />
      </Fab>
    </TSPage>
  );
}
