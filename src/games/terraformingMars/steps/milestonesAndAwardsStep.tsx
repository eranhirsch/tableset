import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";
import mapStep, { MapId, MAPS } from "./mapStep";
import turmoilVariant from "./turmoilVariant";
import venusVariant from "./venusVariant";

export default createDerivedGameStep({
  id: "milestoneAndAward",
  labelOverride: "Milestones and Awards",
  dependencies: [playersMetaStep, mapStep, venusVariant, turmoilVariant],
  skip([playerIds, mapIds, isVenus, isTurmoil]) {
    if (playerIds!.length === 1) {
      // No milestones or awards in Solo games anyway
      return true;
    }

    if (isVenus) {
      // We need to add the venus special milestone and award.
      return false;
    }

    if (!isTurmoil) {
      // Neither Venus or Turmoil are enabled, so there's no milestones or
      // awards to change or add.
      return true;
    }

    if (mapIds == null) {
      // We don't know what map is used, so we'll need to show something about
      // the possibility
      return false;
    }

    // Only the Tharsis map requires changing the awards for Turmoil
    return !mapIds.includes("tharsis");
  },

  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_playerIds, mapIds, isVenus, isTurmoil],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  readonly MapId[],
  boolean,
  boolean
>): JSX.Element {
  return (
    <>
      <HeaderAndSteps>
        {isVenus && (
          <>
            Venus Next: Place the{" "}
            <ChosenElement extraInfo="milestone tile">Hoverlord</ChosenElement>{" "}
            so that it covers the Milestones headline on the game board.
          </>
        )}
        {isVenus && (
          <>
            Venus Next: Place the{" "}
            <ChosenElement extraInfo="award tile">Venuphile</ChosenElement> so
            that it covers the Awards headline on the game board.
          </>
        )}
        {isTurmoil && (mapIds == null || mapIds.includes("tharsis")) && (
          <>
            Turmoil:{" "}
            {mapIds == null ? (
              <>
                <strong>
                  If playing on the <em>{MAPS.tharsis.name}</em> map:
                </strong>{" "}
                place
              </>
            ) : (
              "Place"
            )}{" "}
            the{" "}
            <ChosenElement extraInfo="milestone tile">
              Terraformer
            </ChosenElement>{" "}
            on top of one printed on the board.
          </>
        )}
      </HeaderAndSteps>
      {isVenus && (
        <RulesSection>
          {/* Spell-checker: disable */}
          <>
            Hoverlord works in addition to existing Milestones, so that 3 out of
            6 Milestones may be claimed.
          </>
          <>
            To claim Hoverlord, you need a total of at least 7 floater resources
            on your cards.
          </>
          <>
            Venuphile also works in addition to existing Awards, so that 3 out
            of 6 may be funded.
          </>
          <>Venuphile Award is a contest for most Venus tags in play.</>
          {/* Spell-checker: enable */}
        </RulesSection>
      )}
    </>
  );
}
