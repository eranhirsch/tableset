import { VariableGameStep } from "model/VariableGameStep";

export interface StepWithDependencies<
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never,
  D10 = never
> {
  dependencies:
    | [VariableGameStep<D1>]
    | [VariableGameStep<D1>, VariableGameStep<D2>]
    | [VariableGameStep<D1>, VariableGameStep<D2>, VariableGameStep<D3>]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>,
        VariableGameStep<D8>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>,
        VariableGameStep<D8>,
        VariableGameStep<D9>
      ]
    | [
        VariableGameStep<D1>,
        VariableGameStep<D2>,
        VariableGameStep<D3>,
        VariableGameStep<D4>,
        VariableGameStep<D5>,
        VariableGameStep<D6>,
        VariableGameStep<D7>,
        VariableGameStep<D8>,
        VariableGameStep<D9>,
        VariableGameStep<D10>
      ];
}
