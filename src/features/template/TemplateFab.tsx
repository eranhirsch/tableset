import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress, Fab } from "@mui/material";
import { gameSelector } from "features/game/gameSlice";
import { useFeaturesContext } from "features/useFeaturesContext";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import instanceSlice from "../instance/instanceSlice";
import { templateIsStaleSelector, templateSelectors } from "./templateSlice";

export function TemplateFab(): JSX.Element {
  const dispatch = useAppDispatch();

  const game = useAppSelector(gameSelector);
  const template = useAppSelector(templateSelectors.selectEntities);
  const context = useFeaturesContext();

  const isStale = useAppSelector(templateIsStaleSelector);

  return (
    <Fab
      disabled={isStale}
      component={RouterLink}
      to="/instance"
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      color="primary"
      aria-label="go"
      onClick={() => {
        dispatch(instanceSlice.actions.created(game, template, context));
      }}
    >
      {isStale ? <CircularProgress /> : <PlayArrowIcon />}
    </Fab>
  );
}
