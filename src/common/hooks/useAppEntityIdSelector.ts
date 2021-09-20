import { EntityId, EntitySelectors } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { nullthrows } from "../err";

export const useAppEntityIdSelectorEnforce = <T, S>(
  selectors: EntitySelectors<T, S>,
  id: EntityId
): T =>
  useSelector((state: S) =>
    nullthrows(selectors.selectById(state, id), `Entity '${id}' doesn't exist`)
  );

export const useAppEntityIdSelectorNullable = <T, S>(
  selectors: EntitySelectors<T, S>,
  id: EntityId
): T | undefined => useSelector((state: S) => selectors.selectById(state, id));
