import { EntityId, EntitySelectors } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import nullthrows from "../err/nullthrows";

export function useAppEntityIdSelectorEnforce<T>(
  selectors: EntitySelectors<T, RootState>,
  id: EntityId
): T {
  return nullthrows(
    useAppEntityIdSelectorNullable(selectors, id),
    `Entity '${id}' doesn't exist`
  );
}

export function useAppEntityIdSelectorNullable<T>(
  selectors: EntitySelectors<T, RootState>,
  id: EntityId
): T | undefined {
  return useAppSelector((state) => selectors.selectById(state, id));
}
