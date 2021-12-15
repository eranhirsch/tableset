import { useAppSelector } from "app/hooks";
import { nullthrows, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { Query } from "games/core/steps/Query";
import { Queryable } from "games/core/steps/Queryable";
import { useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { Templatable } from "./Templatable";
import {
  templateActions,
  templateElementSelectorNullable,
  templateSelectors,
} from "./templateSlice";

export function StepConfigPanelWrapper<C = unknown>({
  templatable,
}: {
  templatable: Templatable<unknown, C>;
}): JSX.Element | null {
  const dispatch = useDispatch();

  const element = useAppSelector(templateElementSelectorNullable(templatable));
  const dependencyQueries = useQueries(templatable.dependencies);

  const config = useRef<C>();
  if (element != null) {
    // Update the ref on every change to the config except when it's deleted,
    // this would allow it to keep the value for rendering the collapsing config
    // panel after deletion.
    config.current = element.config;
  }

  const onChange = useCallback(
    (newConfig: Readonly<C> | ((current: Readonly<C>) => Readonly<C>)) => {
      if (element != null) {
        dispatch(
          templateActions.configUpdated(
            templatable as Templatable,
            typeof newConfig === "function"
              ? newConfig(
                  nullthrows(
                    config.current,
                    `ConfigPanel for ${templatable.id} has a null template element for it's initial rendering`
                  )
                )
              : newConfig
          )
        );
      }
    },
    [dispatch, element, templatable]
  );

  return (
    <templatable.ConfigPanel
      config={nullthrows(
        config.current,
        `ConfigPanel for ${templatable.id} has a null template element for it's initial rendering`
      )}
      onChange={onChange}
      queries={dependencyQueries}
    />
  );
}

function useQueries(
  dependencies: readonly [...Queryable<unknown>[]]
): readonly Query[] {
  const context = useFeaturesContext();
  const template = useAppSelector(templateSelectors.selectEntities);

  return useMemo(
    () =>
      Vec.map(dependencies, (dependency) =>
        dependency.query(template, context)
      ),
    [context, dependencies, template]
  );
}
