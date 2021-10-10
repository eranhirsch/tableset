import { VariableGameStep } from "model/VariableGameStep";
import { Queryable } from "./Queryable";

type Dependency<T> = VariableGameStep<T> & Queryable<T>;

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
    | []
    | [Dependency<D1>]
    | [Dependency<D1>, Dependency<D2>]
    | [Dependency<D1>, Dependency<D2>, Dependency<D3>]
    | [Dependency<D1>, Dependency<D2>, Dependency<D3>, Dependency<D4>]
    | [
        Dependency<D1>,
        Dependency<D2>,
        Dependency<D3>,
        Dependency<D4>,
        Dependency<D5>
      ]
    | [
        Dependency<D1>,
        Dependency<D2>,
        Dependency<D3>,
        Dependency<D4>,
        Dependency<D5>,
        Dependency<D6>
      ]
    | [
        Dependency<D1>,
        Dependency<D2>,
        Dependency<D3>,
        Dependency<D4>,
        Dependency<D5>,
        Dependency<D6>,
        Dependency<D7>
      ]
    | [
        Dependency<D1>,
        Dependency<D2>,
        Dependency<D3>,
        Dependency<D4>,
        Dependency<D5>,
        Dependency<D6>,
        Dependency<D7>,
        Dependency<D8>
      ]
    | [
        Dependency<D1>,
        Dependency<D2>,
        Dependency<D3>,
        Dependency<D4>,
        Dependency<D5>,
        Dependency<D6>,
        Dependency<D7>,
        Dependency<D8>,
        Dependency<D9>
      ]
    | [
        Dependency<D1>,
        Dependency<D2>,
        Dependency<D3>,
        Dependency<D4>,
        Dependency<D5>,
        Dependency<D6>,
        Dependency<D7>,
        Dependency<D8>,
        Dependency<D9>,
        Dependency<D10>
      ];
}
