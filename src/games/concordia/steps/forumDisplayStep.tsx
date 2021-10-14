import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import RomanTitle from "../ux/RomanTitle";
import forumVariantStep from "./forumVariantStep";

export default createDerivedGameStep({
  id: "forumDisplay",
  dependencies: [forumVariantStep],
  skip: ([forum]) => forum == null,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Place the{" "}
      <strong>
        <RomanTitle>Forvm</RomanTitle>
      </strong>{" "}
      display board next to the map board, forum side up.
    </Typography>
  );
}
