import { useAppSelector } from "app/hooks";
import { nullthrows, Vec } from "common";
import { useFeaturesContext } from "features/useFeaturesContext";
import { Query } from "games/core/steps/Query";
import { VariableGameStep } from "model/VariableGameStep";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Templatable } from "./Templatable";
import {
  templateActions,
  templateElementSelectorEnforce,
  templateSelectors,
} from "./templateSlice";

export function StepConfigPanelWrapper({
  templatable,
}: {
  templatable: Templatable;
}): JSX.Element | null {
  const dispatch = useDispatch();

  const element = useAppSelector(templateElementSelectorEnforce(templatable));
  const dependencyQueries = useQueries(templatable.dependencies);

  const ConfigPanel = nullthrows(
    templatable.ConfigPanel,
    `Missing config panel for ${templatable.id}`
  );

  return (
    <ConfigPanel
      config={element.config}
      onChange={(newConfig) =>
        dispatch(templateActions.configUpdated(templatable, newConfig))
      }
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
