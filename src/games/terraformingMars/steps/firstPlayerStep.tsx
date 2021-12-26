import { ChosenElement } from "games/core/ux/ChosenElement";
import { createFirstPlayerStep } from "games/global";

export default createFirstPlayerStep({
  FirstPlayerToken: () => (
    <ChosenElement extraInfo="marker">first player</ChosenElement>
  ),
});
