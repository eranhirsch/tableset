import { Dictionary } from "@reduxjs/toolkit";
import { TemplateElement } from "features/template/templateSlice";
import { templateSteps } from "features/template/templateSteps";
import { ContextBase } from "features/useFeaturesContext";
import { GameId } from "games/core/GAMES";
import { StepId } from "model/Game";

export const resolveTemplate = (
  gameId: GameId,
  templateEntities: Dictionary<TemplateElement>,
  context: ContextBase
): Readonly<Record<StepId, NonNullable<unknown>>> =>
  templateSteps({ gameId, entities: templateEntities }).reduce(
    (ongoing, [{ id, resolve }, { config }]) => {
      const resolvedValue = resolve(config, ongoing, context);

      if (resolvedValue == null) {
        return ongoing;
      }

      return { ...ongoing, [id]: resolvedValue };
    },
    {} as Readonly<Record<StepId, unknown>>
  );
