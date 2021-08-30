import { IGameStep } from "./IGameStep";
import { StepId } from "./Game";

export class GenericGameStep implements IGameStep {
  public constructor(
    public readonly id: StepId,
    public readonly labelOverride?: string
  ) {}

  public get label(): string {
    if (this.labelOverride) {
      return this.labelOverride;
    }

    return (
      this.id[0].toUpperCase() + this.id.replaceAll(/[A-Z]/g, " $&").slice(1)
    );
  }
}
