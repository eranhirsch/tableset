import { C } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { useMemo } from "react";
import { ProvinceId, Provinces } from "../utils/Provinces";
import ragnarokStep from "./ragnarokStep";

export default createDerivedGameStep({
  id: "doomToken",
  dependencies: [ragnarokStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [ragnarokProvinceIds],
}: DerivedStepInstanceComponentProps<readonly ProvinceId[]>): JSX.Element {
  const firstAgeProvinceId = useMemo(
    () => (ragnarokProvinceIds == null ? null : C.firstx(ragnarokProvinceIds)),
    [ragnarokProvinceIds]
  );
  return (
    <>
      <em>
        As a constant reminder of which province is doomed to be swallowed next
        by Ragnarök
      </em>
      , place the <ChosenElement>Doom token</ChosenElement> on{" "}
      {firstAgeProvinceId != null ? (
        <strong>{Provinces.label(firstAgeProvinceId)}</strong>
      ) : (
        "the province indicated by the Ragnarök token on the First Age track"
      )}
      .
    </>
  );
}
