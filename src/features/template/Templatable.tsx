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

export type ConfigPanelProps<
  C,
  D0 = never,
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never
> = Readonly<{
  config: Readonly<C | null>;
  queries: readonly [
    Query<D0>,
    Query<D1>,
    Query<D2>,
    Query<D3>,
    Query<D4>,
    Query<D5>,
    Query<D6>,
    Query<D7>,
    Query<D8>,
    Query<D9>
  ];
  onChange(
    newConfig:
      | Readonly<C>
      | ((currentConfig: Readonly<C> | undefined) => Readonly<C>)
  ): void;
}>;

export interface Templatable<T = unknown, C = unknown> extends WithDependencies {
  resolve(
    config: C,
    upstreamInstance: Readonly<Record<StepId, SetupStep>>,
    context: ContextBase
  ): T | null;
  initialConfig(template: Template, context: Readonly<ContextBase>): C;
  refreshTemplateConfig(
    config: C,
    template: Template,
    context: Readonly<ContextBase>
  ): C;
  canBeTemplated(template: Template, context: Readonly<ContextBase>): boolean;

  ConfigPanel(props: {
    config: C | null;
    queries: readonly Query[];
    onChange(newConfig: C | ((currentConfig: C | undefined) => C)): void;
  }): JSX.Element;
  ConfigPanelTLDR(props: { config: C }): JSX.Element;
  disabledTLDROverride?: string;
}

export const isTemplatable = (x: GameStepBase): x is Templatable =>
  (x as Partial<Templatable>).canBeTemplated != null;
