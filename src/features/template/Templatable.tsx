import { SetupStep } from "features/instance/instanceSlice";
import { Query } from "games/core/steps/Query";
import { ContextBase } from "model/ContextBase";
import { StepId } from "model/Game";
import { GameStepBase } from "model/GameStepBase";
import { VariableGameStep } from "model/VariableGameStep";
import { templateSelectors } from "./templateSlice";

export interface WithDependencies extends GameStepBase {
  dependencies: [...VariableGameStep<unknown>[]];
}

export const isWithDependencies = (
  step: GameStepBase
): step is WithDependencies =>
  (step as Partial<WithDependencies>).dependencies != null;

type Template = Readonly<
  ReturnType<typeof templateSelectors["selectEntities"]>
>;
type DependencyQueries = readonly Query[];

export interface Templatable<T = unknown, C = unknown>
  extends WithDependencies {
  resolve(
    config: C,
    upstreamInstance: Readonly<Record<StepId, SetupStep>>,
    context: ContextBase
  ): T | null;
  initialConfig(template: Template, context: Readonly<ContextBase>): C;
  ConfigPanel?: (props: {
    config: C | undefined;
    queries: DependencyQueries;
    onChange(newConfig: C): void;
  }) => JSX.Element;
  refreshTemplateConfig(
    config: C,
    template: Template,
    context: Readonly<ContextBase>
  ): C;
  canBeTemplated(template: Template, context: Readonly<ContextBase>): boolean;
}

export const isTemplatable = (x: GameStepBase): x is Templatable =>
  (x as Partial<Templatable>).canBeTemplated != null;
