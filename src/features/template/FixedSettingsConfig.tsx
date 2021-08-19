import {
  PlayerColors,
  selectors as templateStepSelectors,
} from "./templateSlice";
import { EntityId } from "@reduxjs/toolkit";
import { type_invariant } from "../../common/err/invariant";
import ItemsListPanel from "./panels/ItemsListPanel";
import PlayerColorPanel from "./panels/PlayerColorPanel";
import { useAppEntityIdSelectorEnforce } from "../../common/hooks/useAppEntityIdSelector";
import PlayerOrderPanel from "./panels/PlayerOrderPanel";
import StartingPlayerPanel from "./panels/StartingPlayerPanel";

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
    case "playerColors":
      return (
        <PlayerColorPanel
          playerColors={
            step.value == null ? undefined : (step.value as PlayerColors)
          }
        />
      );
    case "firstPlayer":
      return <StartingPlayerPanel selectedPlayerId={step.value} />;

    default:
      return <ItemsListPanel stepId={stepId} />;
  }
}
