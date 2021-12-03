import { Stack, Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

// TODO: convert this to a randomGameStep and make it dependent on the triumph
// track so we can make this variant configurable so that it is conditional on
// playing with the triumph track
export default createVariant({
  id: "rivals",
  name: "Rivals",
  dependencies: [productsMetaStep],
  isTemplatable: (products) => products.willContain("fenris")!,
  InstanceVariableComponent,
});

function InstanceVariableComponent(): JSX.Element {
  return (
    // All texts here are taken as-is without any modifications from the manual
    // p. 16
    <Stack direction="column" spacing={1}>
      <Typography variant="body1">
        A player is your rival as long as you have 1 of your stars on their home
        base. If you win a combat against a rival, remove 1 of your stars from
        that player’s home base, place it on the Triumph Track, then gain $5.
      </Typography>
      <Typography variant="body2">
        Whenever you win combat, you may remove 1 of your stars from ANY
        opponent’s base and place it on the Triumph Track, but you only gain the
        $5 bonus if the star comes from the base of the defeated opponent.{" "}
      </Typography>
      <Typography variant="body2">
        Stars on an opponent’s base may only be retrieved and placed on the
        Triumph Track through combat.
      </Typography>
    </Stack>
  );
}
