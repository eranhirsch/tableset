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
import warAndPeaceVariant from "./warAndPeaceVariant";
import warOrPeaceStep, { TrackId } from "./warOrPeaceStep";

export default createDerivedGameStep({
  id: "playerObjectives",
  labelOverride: "Objectives",
  dependencies: [
    warAndPeaceVariant,
    warOrPeaceStep,
    factionsStep,
    playerAssignmentsStep,
  ],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [isTriumphTrack, triumphTrackId, factionIds, assignments],
}: DerivedStepInstanceComponentProps<
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
            triumphTrackId !== "war" &&
            (factionIds == null || factionIds.includes("saxony")) && (
              <>
                {triumphTrackId == null && (
                  <em>
                    If the <strong>Peace</strong> triumph track is used
                    {factionIds != null && ":"}
                  </em>
                )}
                {factionIds == null && (
                  <em>
                    {triumphTrackId == null && " and"} if they are in play:
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
