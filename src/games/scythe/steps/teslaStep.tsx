import { Typography } from "@mui/material";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { RulesSection } from "games/global/ux/RulesSection";
import teslaVariant from "./teslaVariant";

export default createDerivedGameStep({
  id: "tesla",
  dependencies: [teslaVariant],
  skip: (isEnabled) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Put the <strong>Tesla</strong> <em>miniature (plastic)</em> near the
        board.
      </Typography>
      <Typography variant="body2" marginTop={2}>
        <em>
          {/* Copied from the manual, page 51 */}
          Tesla can alternately be assigned at the beginning of a game to any
          faction you consider to be “weaker” than the other factions. In that
          case, he starts on that faction’s home base.
        </em>
      </Typography>
      <RulesSection>
        <>
          {/* Copied from the manual, page 51 */}
          The first player to have 3 encounters completes the third encounter
          and then controls Tesla, placing him on the 3rd encounter territory.
        </>
        <>
          {/* Copied from the manual, page 37 */}
          Tesla is both a character and a mech for all standard and special
          abilities (although he is not counted towards the Mech goal on the
          Triumph Track). Tesla can have encounters, claim factory cards,
          transport workers, and use all of your faction and mech abilities.
        </>
      </RulesSection>
    </>
  );
}
