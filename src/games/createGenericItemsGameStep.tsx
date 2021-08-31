import { Typography } from "@material-ui/core";
import { Strategy } from "../core/Strategy";
import templateSlice from "../features/template/templateSlice";
import { createGameStep } from "./createGameStep";
import { StepId } from "./IGame";
import IGameStep, { InstanceContext } from "./IGameStep";
import GenericItemsFixedTemplateLabel from "./ux/GenericItemsFixedTemplateLabel";
import GenericItemsListPanel from "./ux/GenericItemsListPanel";

interface CreateGenericItemsGameStepOptions<T extends string = string> {
  id: StepId;
  itemIds: readonly T[];
  labelFor(itemId: T): string;
  recommended?(context: InstanceContext): T | undefined;
}

export default function createGenericItemsGameStep<T extends string = string>({
  id,
  itemIds,
  labelFor,
  recommended,
}: CreateGenericItemsGameStepOptions<T>): IGameStep {
  return createGameStep<T>({
    id,
    derivers: {
      renderInstanceItem: (itemId) => (
        <Typography variant="h4" sx={{ fontVariantCaps: "petite-caps" }}>
          {labelFor(itemId)}
        </Typography>
      ),

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
    },
  });
}
