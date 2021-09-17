import { EntityId, EntitySelectors } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import nullthrows from "../err/nullthrows";

export const useAppEntityIdSelectorEnforce = <T>(
  selectors: EntitySelectors<T, unknown>,
  id: EntityId
): T =>
  useAppSelector((state) =>
    nullthrows(selectors.selectById(state, id), `Entity '${id}' doesn't exist`)
  );

export const useAppEntityIdSelectorNullable = <T>(
  selectors: EntitySelectors<T, unknown>,
  id: EntityId
): T | undefined => useAppSelector((state) => selectors.selectById(state, id));

