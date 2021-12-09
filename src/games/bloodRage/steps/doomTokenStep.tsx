import { C } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { useMemo } from "react";
import { Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";
import ragnarokStep from "./ragnarokStep";

export default createDerivedGameStep({
  id: "doomToken",
  dependencies: [ragnarokStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [ragnarokIdx],
}: DerivedStepInstanceComponentProps<number>): JSX.Element {
  const firstAgeProvinceId = useMemo(
    () => (ragnarokIdx == null ? null : C.firstx(Ragnarok.decode(ragnarokIdx))),
    [ragnarokIdx]
  );
  return (
    <>
      <em>
        As a constant reminder of which province is doomed to be swallowed next
        by Ragnarök
      </em>
      , place the <ChosenElement>Doom token</ChosenElement>
      on{" "}
      {firstAgeProvinceId != null ? (
        <strong>{Provinces.label(firstAgeProvinceId)}</strong>
      ) : (
        "the province indicated by the Ragnarök token on the First Age track"
      )}
      .
    </>
  );
}
