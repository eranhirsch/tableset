import { Typography } from "@mui/material";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { RulesSection } from "games/global/ux/RulesSection";
import rivalsVariant from "./rivalsVariant";
import warAndPeaceVariant from "./warAndPeaceVariant";

export default createDerivedGameStep({
  id: "rivalsSetup",
  labelOverride: "Rivals: Setup",
  dependencies: [rivalsVariant, warAndPeaceVariant],
  skip: ([isEnabled]) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [_isEnabled, isTriumphEnabled],
}: DerivedStepInstanceComponentProps<boolean, boolean>): JSX.Element {
  return (
    // All texts here are taken as-is without any modifications from the manual
    // p. 16
    <>
      <Typography variant="body1">
        All players may <em>simultaneously</em> declare “rivals” by placing 1 or
        more of their stars on other players’ home bases. They may place up to{" "}
        <strong>{isTriumphEnabled ? 4 : 2}</strong> of their stars this way, and
        they may place multiple stars on the same home base.
      </Typography>
      <RulesSection>
        <>
          A player is your rival as long as you have 1 of your stars on their
          home base. If you win a combat against a rival, remove 1 of your stars
          from that player’s home base, place it on the Triumph Track, then gain
          $5.
        </>
        <>
          Whenever you win combat, you may remove 1 of your stars from ANY
          opponent’s base and place it on the Triumph Track, but you only gain
          the $5 bonus if the star comes from the base of the defeated opponent.{" "}
        </>
        <>
          Stars on an opponent’s base may only be retrieved and placed on the
          Triumph Track through combat.
        </>
      </RulesSection>
    </>
  );
}
