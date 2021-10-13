import { useAppSelector } from "app/hooks";
import { nullthrows, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { Query } from "games/core/steps/Query";
import { VariableGameStep } from "model/VariableGameStep";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Templatable } from "./Templatable";
import {
  templateActions,
  templateElementSelectorNullable,
  templateSelectors,
} from "./templateSlice";

export function StepConfigPanelWrapper({
  templatable,
}: {
  templatable: Templatable;
}): JSX.Element | null {
  const dispatch = useDispatch();

  const element = useAppSelector(templateElementSelectorNullable(templatable));
  const dependencyQueries = useQueries(templatable.dependencies);

  const ConfigPanel = nullthrows(
    templatable.ConfigPanel,
    `Missing config panel for ${templatable.id}`
  );

  const onChange = useCallback(
    (newConfig) =>
      dispatch(
        templateActions.configUpdated(
          templatable,
          typeof newConfig === "function"
            ? newConfig(element?.config)
            : newConfig
        )
      ),
    [dispatch, element?.config, templatable]
  );

  return (
    <ConfigPanel
      config={element?.config}
      onChange={onChange}
      queries={dependencyQueries}
    />
  );
}

function useQueries(
  dependencies: [...VariableGameStep<unknown>[]]
): readonly [...Query[]] {
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
