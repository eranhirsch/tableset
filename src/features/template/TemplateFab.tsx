import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress, Fab } from "@mui/material";
import { $ } from "common";
import { InstanceUrlUtils } from "features/instance/InstanceUrlUtils";
import { useFeaturesContext } from "features/useFeaturesContext";
import { GAMES } from "games/core/GAMES";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { resolveTemplate } from "./resolveTemplate";
import {
  templateIsStaleSelector,
  wholeTemplateSelector,
} from "./templateSlice";

export function TemplateFab(): JSX.Element {
  const navigate = useNavigate();

  const { entities, gameId } = useAppSelector(wholeTemplateSelector);
  const context = useFeaturesContext();

  const isStale = useAppSelector(templateIsStaleSelector);

  const game = $(
    gameId,
    $.nullthrows(`Missing game Id!`),
    ($$) => GAMES[$$],
    $.nullthrows(`Unknown game id ${gameId}`)
  );

  return (
    <Fab
      disabled={isStale}
      sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 999 }}
      color="primary"
      onClick={() =>
        $(
          resolveTemplate(gameId!, entities, context),
          ($$) => InstanceUrlUtils.encode(game, $$),
          ($$) => navigate(`/${gameId}/${$$}`)
        )
      }
    >
      {isStale ? <CircularProgress /> : <PlayArrowIcon />}
    </Fab>
  );
}

