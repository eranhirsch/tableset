import { StepId } from "features/instance/Game";
import { GameStepBase } from "features/instance/GameStepBase";
import { InstanceValueStep } from "features/instance/instanceValue";
import { ContextBase } from "features/useFeaturesContext";
import { Query } from "games/core/steps/Query";
import { Queryable } from "games/core/steps/Queryable";
import { templateSelectors } from "./templateSlice";

export type Dependency<T> = Queryable<T> & InstanceValueStep<T>;

export interface WithDependencies extends GameStepBase {
  dependencies: readonly Dependency<unknown>[];
}

export const isWithDependencies = (
  step: GameStepBase
): step is WithDependencies =>
  (step as Partial<WithDependencies>).dependencies != null;

type Template = Readonly<
  ReturnType<typeof templateSelectors["selectEntities"]>
>;

export interface Templatable<T = unknown, C extends object | unknown = unknown>
  extends WithDependencies,
    Queryable<T> {
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
  InstanceCards?(props: {
    value: T;
    dependencies: readonly unknown[];
    onClick(): void;
  }): JSX.Element | null;

  InstanceVariableComponent(props: { value: T }): JSX.Element;
}

export const isTemplatable = (x: GameStepBase): x is Templatable =>
  (x as Partial<Templatable>).canBeTemplated != null;
