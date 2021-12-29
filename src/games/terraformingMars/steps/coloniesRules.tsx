import { Vec } from "common";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { useMemo } from "react";
import coloniesStep, {
  ColonyId,
  labelForId,
  SPECIAL_COLONIES,
} from "./coloniesStep";
import coloniesVariant from "./coloniesVariant";

export default createDerivedGameStep({
  id: "coloniesRules",
  labelOverride: "Colonies: Rules",
  dependencies: [coloniesVariant, coloniesStep],
  skip: ([isColonies]) => !isColonies,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_isColonies, colonyIds],
}: DerivedStepInstanceComponentProps<
  boolean,
  readonly ColonyId[]
>): JSX.Element {
  const activeSpecialColonies = useMemo(
    () =>
      colonyIds == null
        ? SPECIAL_COLONIES
        : Vec.diff(SPECIAL_COLONIES, colonyIds),
    [colonyIds]
  );
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Additional rules for <em>Colonies</em>:
        </>
      }
    >
      <>
        The white marker cube on each colony indicates what you can gain from
        trading there.
      </>
      {!Vec.is_empty(activeSpecialColonies) && (
        <>
          <strong>
            for{" "}
            <GrammaticalList>
              {Vec.map(activeSpecialColonies, labelForId)}
            </GrammaticalList>
          </strong>
          : the marker is placed on the highlighted second step of the track
          immediately when there is any card in play that may collect their
          respective resources. You can not place a colony there, or trade
          there, until that happens.
        </>
      )}
      <>
        When performing the <strong>BUILD COLONY</strong> standard project: move
        the white marker up 1 step if necessary when placing the player marker.
      </>
      <>
        Only <strong>3</strong> colonies total per Colony Tile are allowed - no
        exceptions!
      </>
      <>
        Each player may only have <strong>1</strong> colony per Colony Tile
        (unless stated otherwise on a card).
      </>
      <>A Colony Tile may only hold 1 trade fleet at a time.</>
    </HeaderAndSteps>
  );
}
