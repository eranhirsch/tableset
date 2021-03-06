import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { playersMetaStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";
import alliancesVariant from "./alliancesVariant";

export default createDerivedGameStep({
  id: "alliances",
  labelOverride: "Alliances: Token",
  dependencies: [playersMetaStep, alliancesVariant],
  skip: ([_, isEnabled]) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
  return (
    // Copied from the manual, page 18
    <>
      <Typography variant="body1">
        Each player starts with an Alliance token that has their faction and a
        coin amount on the front and -$10 on the back. The other Alliance tokens
        are returned to the box..
      </Typography>
      <RulesSection>
        <>
          At any time during your turn, if you have your faction’s Alliance
          token, you may propose an alliance with another player who has their
          own Alliance token. If they agree, switch tokens with that player and
          gain the coin bonus on the token you receive from the general supply.
          You now have their faction ability as noted on the token in addition
          to the ability on your faction mat.
        </>
        {playerIds!.length % 2 === 1 && (
          <em>The moment you become the “odd man out,” gain $5.</em>
        )}
        <>
          If you ever attack a player who has your{" "}
          <strong>faction’s Alliance token</strong> or force their workers off a
          territory, you must flip over the token you have. You no longer have
          that faction ability (the other player keeps your token with the
          ability face up).
        </>
        <>
          During end-game scoring, if the token you have is showing -$10 (i.e.,
          you broke the alliance), lose $10.
        </>
      </RulesSection>
    </>
  );
}
