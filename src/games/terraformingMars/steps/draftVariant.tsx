import { Typography } from "@mui/material";
import { createVariant } from "games/core/steps/createVariant";

export default createVariant({
  id: "draft",
  name: "Draft",
  dependencies: [],
  isTemplatable: () => true,
  Description,
});

function Description(): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        If more interaction is desired, the Draft variant may be used.
        <br />
        This variant allows players to affect which cards other players get
        access to, and increases your ability to pursue a certain strategy, or
        predict which parameter will rise first.
      </Typography>
      <Typography variant="body2">
        The Draft Variant adds some extra game time and is not recommended for
        players new to <em>Terraforming Mars</em>.
      </Typography>
    </>
  );
}
