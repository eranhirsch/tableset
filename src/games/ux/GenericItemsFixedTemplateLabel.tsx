export default function GenericItemsFixedTemplateLabel<
  T extends string = string
>({
  onLabelForItem,
  selectedId,
}: {
  onLabelForItem: (id: T) => string;
  selectedId: T;
}) {
  return <>{onLabelForItem(selectedId)}</>;
}
