import {
  PlayerColors,
  selectors as templateStepSelectors,
} from "./templateSlice";
import { EntityId } from "@reduxjs/toolkit";
import useAppEntityIdSelectorEnforce from "../../common/hooks/useAppEntityIdSelectorEnforce";
import { type_invariant } from "../../common/err/invariant";
import PlayerOrderPanel from "./panels/PlayerOrderPanel";
import ItemsListPanel from "./panels/ItemsListPanel";
import PlayerColorPanel from "./panels/PlayerColorPanel";

export default function FixedSettingsConfig({ stepId }: { stepId: EntityId }) {
  const step = useAppEntityIdSelectorEnforce(templateStepSelectors, stepId);

  switch (step.id) {
    case "playOrder":
      return (
        <PlayerOrderPanel
          order={
            step.value == null
              ? undefined
              : type_invariant(step.value, Array.isArray)
          }
        />
      );
    case "playerColor":
      return (
        <PlayerColorPanel
          playerColors={
            step.value == null ? undefined : (step.value as PlayerColors)
          }
        />
      );

    default:
      return <ItemsListPanel stepId={stepId} />;
  }
}
