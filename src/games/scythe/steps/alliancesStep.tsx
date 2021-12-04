import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, Stack, Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { useState } from "react";
import alliancesVariant from "./alliancesVariant";

export default createDerivedGameStep({
  id: "alliances",
  labelOverride: "Alliances: Token",
  dependencies: [alliancesVariant],
  skip: ([isEnabled]) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  const [showRules, setShowRules] = useState(false);

  return (
    // Copied from the manual, page 18
    <>
      <Typography variant="body1">
        Each player starts with an Alliance token that has their faction and a
        coin amount on the front and -$10 on the back. The other Alliance tokens
        are returned to the box..
      </Typography>
      <Typography
        variant="subtitle1"
        color="primary"
        marginTop={2}
        onClick={() => setShowRules((current) => !current)}
        display="flex"
        alignItems="center"
      >
        {showRules ? <ExpandLessIcon /> : <ExpandMoreIcon />} Rules
      </Typography>
      <Collapse in={showRules}>
        <Stack direction="column" spacing={1} paddingX={2} textAlign="justify">
          <Typography variant="body2">
            At any time during your turn, if you have your faction’s Alliance
            token, you may propose an alliance with another player who has their
            own Alliance token. If they agree, switch tokens with that player
            and gain the coin bonus on the token you receive from the general
            supply. You now have their faction ability as noted on the token in
            addition to the ability on your faction mat.
            <br />
          </Typography>
          <Typography variant="body2">
            <em>
              In games with an odd number of players, the moment you become the
              “odd man out,” gain $5.
            </em>
          </Typography>
          <Typography variant="body2">
            If you ever attack a player who has your{" "}
            <strong>faction’s Alliance token</strong> or force their workers off
            a territory, you must flip over the token you have. You no longer
            have that faction ability (the other player keeps your token with
            the ability face up).
          </Typography>
          <Typography variant="body2">
            During end-game scoring, if the token you have is showing -$10
            (i.e., you broke the alliance), lose $10.
          </Typography>
        </Stack>
      </Collapse>
    </>
  );
}
