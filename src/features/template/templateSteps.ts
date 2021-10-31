import { Dictionary } from "@reduxjs/toolkit";
import { Dict, tuple, type_invariant, Vec } from "common";
import { GameId, GAMES } from "games/core/GAMES";
import { StepId } from "model/Game";
import { isTemplatable, Templatable } from "./Templatable";
import { TemplateElement } from "./templateSlice";

/**
 * Returns a tuple with both the template element and the Templatable
 * definition, while maintaining the original game order (order is important
 * because step dependencies are acyclic, so traversing the steps in order would
 * mean we always see a parent dependency before the downstream step that
 * depends on it)
 */
export function templateSteps({
  gameId,
  entities,
}: {
  gameId?: GameId;
  entities: Dictionary<TemplateElement>;
}): readonly [Templatable, TemplateElement][] {
  if (gameId == null) {
    return [];
  }

  return Vec.map_with_key(
    // The inner join is the cleanest way to filter both dicts on each-other's
    // keys.
    Dict.inner_join(
      GAMES[gameId].steps,
      // We need the cast because `Dictionary` (the RTK-defined type) is funky
      Dict.filter_nulls(entities) as Record<StepId, TemplateElement>
    ),
    (_, [step, elem]) =>
      tuple(
        // We `type_invariant` here instead of using a TS compile-time cast just
        // to be extra safe. All steps in the template should be `Templatable`, so
        // nothing here should throw
        type_invariant(
          step,
          isTemplatable,
          `Step ${step.id} is present in the template but is not Templatable!`
        ),
        elem
      )
  );
}
