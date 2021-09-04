import Strategy from "../../../core/Strategy";
import templateSlice from "../../../features/template/templateSlice";
import { StepId } from "../IGame";
import GenericItemsFixedTemplateLabel from "../ux/GenericItemsFixedTemplateLabel";
import GenericItemsListPanel from "../ux/GenericItemsListPanel";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "./createVariableGameStep";
import { InstanceContext } from "./IGameStep";

interface CreateGenericItemsGameStepOptions<T extends string = string> {
  id: StepId;

  itemIds: readonly T[];

  labelFor(itemId: T): string;
  render(props: VariableStepInstanceComponentProps<T>): JSX.Element;

  isType?(x: string): x is T;
  recommended?(context: InstanceContext): T | undefined;
}

const createGenericItemsGameStep = <T extends string = string>({
  id,
  itemIds,
  labelFor,
  render,
  isType,
  recommended,
}: CreateGenericItemsGameStepOptions<T>) =>
  createVariableGameStep({
    id,
    isType,

    render,

    random: () => itemIds[Math.floor(Math.random() * itemIds.length)],

    recommended,

    fixed: {
      initializer: () => ({
        id,
        strategy: Strategy.FIXED,
        value: itemIds[0],
      }),

      renderTemplateLabel: (current) => (
        <GenericItemsFixedTemplateLabel
          onLabelForItem={labelFor}
          selectedId={current}
        />
      ),
      renderSelector: (current) => (
        <GenericItemsListPanel
          itemIds={itemIds}
          selectedId={current}
          onLabelForItem={labelFor}
          onUpdateItem={(itemId) =>
            templateSlice.actions.constantValueChanged({
              id,
              value: itemId,
            })
          }
        />
      ),
    },
  });
export default createGenericItemsGameStep;
