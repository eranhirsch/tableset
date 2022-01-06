import { Typography } from "@mui/material";
import createTeamVariant from "games/global/steps/createTeamVariant";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";

export default createTeamVariant({
  productDependencies: {
    step: productsMetaStep,
    products: ["venus", "venusBase"],
  },
  optionalAt: [4],
  enabledAt: [6],
  Description,
});

function Description(): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Players pair up and win or lose together, playing off each other's
        cards.
      </Typography>
      <Typography variant="body2">
        <em>With new cards</em>:{" "}
        <strong>
          <RomanTitle>Praetors</RomanTitle>
        </strong>{" "}
        and{" "}
        <strong>
          <RomanTitle>Proconsuls</RomanTitle>
        </strong>{" "}
        replace the <RomanTitle>Senators</RomanTitle> and{" "}
        <RomanTitle>Consuls</RomanTitle>, the{" "}
        <strong>
          <RomanTitle>
            {/* spell-checker: disable */}Legatus{/* spell-checker: enable */}
          </RomanTitle>
        </strong>{" "}
        in the starting hand, and <strong>double-role</strong> cards in the
        market.
      </Typography>
    </>
  );
}
