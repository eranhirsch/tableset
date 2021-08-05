import { EntityId } from "@reduxjs/toolkit";
import { useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import nullthrows from "../err/nullthrows";

export default function useAppIdSelectorEnforce<T>(
  selector: (state: RootState, id: EntityId) => T | undefined,
  id: EntityId
): T {
  return nullthrows(useAppSelector((state) => selector(state, id)));
}
