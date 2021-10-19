import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "venusScoring",
  name: "Venus Scoring",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContainAny(["venus", "venusBase"]),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Cards with the goddess{" "}
      <strong>
        <RomanTitle>
          {/* spell-checker: disable */}Venvs{/* spell-checker: enable */}
        </RomanTitle>
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
