export function GenericItemsFixedTemplateLabel<T extends string = string>({
  onLabelForItem,
  selectedId,
}: {
  onLabelForItem: (id: T) => string;
  selectedId: T;
}): JSX.Element | null {
  return <>{onLabelForItem(selectedId)}</>;
}
