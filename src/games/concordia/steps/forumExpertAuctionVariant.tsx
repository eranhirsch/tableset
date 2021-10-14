import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import forumVariantStep from "./forumVariantStep";

export default createVariant({
  id: "forumAuction",
  name: "Forum Expert Auction",
  dependencies: [forumVariantStep],
  isTemplatable: (forum) => forum.canResolveTo(true),
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Players will bid points from their final score to get the starting forum
      tile they prefer.
    </Typography>
  );
}
