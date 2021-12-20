import avro from "avsc";
import { StepId } from "./Game";

export interface GameStepBase {
  readonly id: StepId;
  readonly label: string;
  readonly InstanceManualComponent?: (() => JSX.Element) | string;
  readonly instanceAvroType?: avro.schema.DefinedType;
}
