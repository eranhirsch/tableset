import { IItemsGameStep } from "./GenericItemsListPanel";

export default function GenericItemsFixedTemplateLabel({
  itemsStep,
  selectedItemId,
}: {
  itemsStep: IItemsGameStep;
  selectedItemId: string;
}) {
  return <>{itemsStep.labelForItem(selectedItemId)}</>;
}
