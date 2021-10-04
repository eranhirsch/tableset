import { Random } from "common";
import { templateActions } from "features/template/templateSlice";
import { StepId } from "../../../model/IGame";
import { InstanceContext } from "../../../model/IGameStep";
import GenericItemsFixedTemplateLabel from "../ux/GenericItemsFixedTemplateLabel";
import GenericItemsListPanel from "../ux/GenericItemsListPanel";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps,
} from "./createVariableGameStep";

interface CreateGenericItemsGameStepOptions<T extends string = string> {
  id: StepId;

  itemIds: readonly T[];

  labelFor(itemId: T): string;
  InstanceManualComponent(): JSX.Element;
  InstanceVariableComponent(
    props: VariableStepInstanceComponentProps<T>
  ): JSX.Element;

  isType?(x: string): x is T;
  recommended?(context: InstanceContext): T | undefined;
}

const createGenericItemsGameStep = <T extends string>({
  id,
  itemIds,
  labelFor,
  InstanceManualComponent,
  InstanceVariableComponent,
  isType,
  recommended,
}: CreateGenericItemsGameStepOptions<T>) =>
  createVariableGameStep({
    id,
    isType,

    InstanceManualComponent,
    InstanceVariableComponent,

    random: () => itemIds[Random.index(itemIds)],

    recommended,

    fixed: {
      initializer: () => itemIds[0],

      renderTemplateLabel: ({ value }) => (
        <GenericItemsFixedTemplateLabel
          onLabelForItem={labelFor}
          selectedId={value}
        />
      ),
      renderSelector: ({ current }) => (
        <GenericItemsListPanel
          itemIds={itemIds}
          selectedId={current}
          onLabelForItem={labelFor}
          onUpdateItem={(itemId) =>
            templateActions.constantValueChanged({
              id,
              value: itemId,
            })
          }
        />
      ),
    },
  });
export default createGenericItemsGameStep;
