import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";
import teamPlayVariant from "./teamPlayVariant";

export default createVariant({
  id: "venusScoring",
  name: "Venus Scoring",
  dependencies: [productsMetaStep, teamPlayVariant],
  isTemplatable: (products, isTeamPlay) =>
    products.willContainAny(["venus", "venusBase"]) &&
    isTeamPlay.canResolveTo(false),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Cards with the goddess{" "}
      <strong>
        <RomanTitle>VENVS</RomanTitle>
      </strong>{" "}
      are added to the game; paired with a new role{" "}
      <em>
        <RomanTitle>Magister</RomanTitle>
      </em>{" "}
      added to player's starting cards, and double-role cards added to the
      market.
    </Typography>
  );
}
