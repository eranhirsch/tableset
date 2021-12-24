import { Typography } from "@mui/material";
import { createGameStep } from "games/core/steps/createGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";

export default createGameStep({
  id: "startingConditions",
  InstanceManualComponent: () => (
    <>
      <HeaderAndSteps synopsis="In player order, each player:">
        <>
          Reveals which corporation they will play
          <em>; Put the discarded corporation back in the box</em>.
        </>
        <>
          Take any starting resources and production stated on the corporation
          card.
        </>
        <>
          Discard any project cards they don't want to keep to a common discard
          pile<em>; cards are always discarded face down!</em>
        </>
        <>
          Pay <strong>3M€</strong> for each project card they keep.
        </>
      </HeaderAndSteps>
      <Typography variant="body2">
        <em>
          Be aware that your resources for the following few generations will be
          quite limited until you get your economy going.
        </em>
      </Typography>
    </>
  ),
});
