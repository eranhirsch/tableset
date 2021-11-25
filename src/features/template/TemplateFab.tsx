import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { CircularProgress, Fab } from "@mui/material";
import { $, base64Url, Dict } from "common";
import { SetupStep } from "features/instance/instanceSlice";
import { useFeaturesContext } from "features/useFeaturesContext";
import { GAMES } from "games/core/GAMES";
import { StepId } from "model/Game";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import {
  templateIsStaleSelector,
  wholeTemplateSelector,
} from "./templateSlice";
import { templateSteps } from "./templateSteps";

export function TemplateFab(): JSX.Element {
  const navigate = useNavigate();

  const { entities, gameId } = useAppSelector(wholeTemplateSelector);
  const context = useFeaturesContext();

  const isStale = useAppSelector(templateIsStaleSelector);

  return (
    <Fab
      disabled={isStale}
      sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 999 }}
      color="primary"
      onClick={() =>
        $(
          templateSteps({ gameId, entities }),
          ($$) =>
            $$.reduce(
              (ongoing, [{ id, resolve }, { config }]) =>
                $(resolve(config, ongoing, context), ($$) =>
                  $$ == null
                    ? ongoing
                    : {
                        ...ongoing,
                        [id]: { id, value: $$ },
                      }
                ),
              {} as Readonly<Record<StepId, SetupStep>>
            ),
          // TODO: The infra currently expects `SetupStep` in the resolve method,
          // but we can simply move to a simpler model with just the value. When we
          // do that we can drop this redundant mapper.
          ($$) => Dict.map($$, ({ value }) => value),
          ($$) => GAMES[gameId!].instanceAvroType.toBuffer($$),
          ($$) => base64Url.encode($$),
          ($$) => navigate(`/${gameId}/${$$}`)
        )
      }
    >
      {isStale ? <CircularProgress /> : <PlayArrowIcon />}
    </Fab>
  );
}

