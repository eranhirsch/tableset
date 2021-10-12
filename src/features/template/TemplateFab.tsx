import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress, Fab } from "@mui/material";
import { useFeaturesContext } from "features/useFeaturesContext";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { instanceSlice } from "../instance/instanceSlice";
import {
  templateIsStaleSelector,
  wholeTemplateSelector,
} from "./templateSlice";
import { templateSteps } from "./templateSteps";

export function TemplateFab(): JSX.Element {
  const dispatch = useAppDispatch();

  const wholeTemplate = useAppSelector(wholeTemplateSelector);
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
        dispatch(
          instanceSlice.actions.created(templateSteps(wholeTemplate), context)
        );
      }}
    >
      {isStale ? <CircularProgress /> : <PlayArrowIcon />}
    </Fab>
  );
}
