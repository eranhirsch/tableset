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

export interface Templatable<T = unknown, C extends object | unknown = unknown>
  extends WithDependencies {
  isVariant?: true;
  resolve(
    config: C,
    upstreamInstance: Readonly<Record<StepId, unknown>>,
    context: ContextBase
  ): T | null;
  initialConfig:
    | Readonly<C>
    | ((template: Template, context: Readonly<ContextBase>) => Readonly<C>);
  refreshTemplateConfig(
    config: Readonly<C>,
    template: Template,
    context: Readonly<ContextBase>
  ): Readonly<C>;
  canBeTemplated(template: Template, context: Readonly<ContextBase>): boolean;

  ConfigPanel(props: {
    config: Readonly<C>;
    queries: readonly Query[];
    onChange(
      newConfig: Readonly<C> | ((currentConfig: Readonly<C>) => Readonly<C>)
    ): void;
  }): JSX.Element;
  ConfigPanelTLDR(props: { config: Readonly<C> }): JSX.Element;
  disabledTLDROverride?: string;

  InstanceCards?(props: {
    value: T;
    dependencies: readonly unknown[];
    onClick(): void;
  }): JSX.Element | null;
}

export const isTemplatable = (x: GameStepBase): x is Templatable =>
  (x as Partial<Templatable>).canBeTemplated != null;
