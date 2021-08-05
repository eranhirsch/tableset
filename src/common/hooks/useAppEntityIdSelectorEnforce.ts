import { EntityId, EntitySelectors } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import nullthrows from "../err/nullthrows";

export default function useAppEntityIdSelectorEnforce<T>(
  selectors: EntitySelectors<T, RootState>,
  id: EntityId
): T {
  return nullthrows(useAppSelector((state) => selectors.selectById(state, id)));
}
