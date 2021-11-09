import { useAppDispatch, useAppSelector } from "app/hooks";
import { TSPage } from "app/ux/Chrome";
import { Dict } from "common";
import { gameSelector } from "features/game/gameSlice";
import { useGameHomeToolbarButton } from "features/game/useGameHomeToolbarButton";
import { useFeaturesContext } from "features/useFeaturesContext";
import { useEffect } from "react";
import { TemplateFab } from "./TemplateFab";
import { TemplateList } from "./TemplateList";
import {
  fullTemplateSelector,
  templateActions,
  templateIsStaleSelector,
} from "./templateSlice";

export function Template(): JSX.Element | null {
  const game = useAppSelector(gameSelector);
  const homeButton = useGameHomeToolbarButton();

  useRefreshOnStale();
  useLogTemplate();

  return (
    <TSPage title={`Recipe for ${game.name}`} buttons={[homeButton]}>
      <TemplateList />
      <TemplateFab />
    </TSPage>
  );
}

/**
 * Dispatch a refresh action whenever the template is stale
 */
export function useRefreshOnStale(): void {
  const dispatch = useAppDispatch();

  const context = useFeaturesContext();
  const isStale = useAppSelector(templateIsStaleSelector);

  useEffect(() => {
    if (isStale) {
      dispatch(templateActions.refresh(context));
    }
  }, [context, dispatch, isStale]);
}

/**
 * Just log the whole template normalized for debugging
 */
export function useLogTemplate(): void {
  const fullTemplate = useAppSelector(fullTemplateSelector);
  useEffect(() => {
    console.log("TEMPLATE", Dict.sort_by_key(fullTemplate));
  }, [fullTemplate]);
}
