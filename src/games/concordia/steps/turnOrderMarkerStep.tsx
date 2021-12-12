import { Typography } from "@mui/material";
import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import firstPlayerStep from "./firstPlayerStep";
import teamPlayVariant from "./teamPlayVariant";

export default createDerivedGameStep({
  id: "activePlayerMarker",
  dependencies: [teamPlayVariant, firstPlayerStep],
  skip: ([teamPlay]) => !teamPlay,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_, firstPlayerId],
}: DerivedStepInstanceComponentProps<boolean, PlayerId>): JSX.Element {
  const marker = (
    <>
      orange wooden <strong>turn order marker</strong>
    </>
  );

  return firstPlayerId == null ? (
    <BlockWithFootnotes footnote={<InstanceStepLink step={firstPlayerStep} />}>
      {(Footnote) => (
        <>
          Give the <em>first player</em>
          <Footnote /> the {marker}.
        </>
      )}
    </BlockWithFootnotes>
  ) : (
    <Typography variant="body1">
      Give <PlayerAvatar playerId={firstPlayerId} inline /> the {marker}.
    </Typography>
  );
}
