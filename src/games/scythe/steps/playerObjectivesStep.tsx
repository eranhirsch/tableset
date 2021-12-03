import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { PlayerId } from "model/Player";
import { FactionId } from "../utils/Factions";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import rivalsVariant from "./rivalsVariant";
import warAndPeaceVariant from "./warAndPeaceVariant";
import warOrPeaceStep, { TrackId } from "./warOrPeaceStep";

export default createDerivedGameStep({
  id: "playerObjectives",
  labelOverride: "Objectives",
  dependencies: [
    warAndPeaceVariant,
    rivalsVariant,
    warOrPeaceStep,
    factionsStep,
    playerAssignmentsStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [
    isTriumphTrack,
    isRivals,
    triumphTrackId,
    factionIds,
    assignments,
  ],
}: DerivedStepInstanceComponentProps<
  boolean,
  boolean,
  TrackId,
  readonly FactionId[],
  readonly PlayerId[]
>): JSX.Element {
  return (
    <BlockWithFootnotes
      footnote={
        <>
          Players should keep the cards <em>secret</em>.
        </>
      }
    >
      {(Footnote) => (
        <>
          Deal each player a hand of <strong>2</strong> objective cards
          <Footnote />.<br />
          {isTriumphTrack &&
            !isRivals &&
            triumphTrackId !== "war" &&
            (factionIds == null || factionIds.includes("saxony")) && (
              <>
                {triumphTrackId == null && !isRivals && (
                  <em>
                    If the <strong>Peace</strong> triumph track is used
                    {factionIds != null && ":"}
                  </em>
                )}
                {factionIds == null && (
                  <em>
                    {triumphTrackId == null && !isRivals && " and"} if they are
                    in play:
                  </em>
                )}{" "}
                give{" "}
                {factionIds != null && assignments != null ? (
                  <PlayerAvatar
                    playerId={assignments[factionIds.indexOf("saxony")]}
                    inline
                  />
                ) : (
                  <FactionChip factionId="saxony" />
                )}{" "}
                an additional objective card (to compensate for the lack of
                combat victory stars).
              </>
            )}
        </>
      )}
    </BlockWithFootnotes>
  );
}
