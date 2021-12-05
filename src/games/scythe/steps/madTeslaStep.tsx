import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { RulesSection } from "games/global/ux/RulesSection";
import madTeslaVariant from "./madTeslaVariant";

export default createDerivedGameStep({
  id: "madTesla",
  dependencies: [madTeslaVariant],
  skip: (isEnabled) => !isEnabled,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent(): JSX.Element {
  return (
    <>
      <HeaderAndSteps>
        {/* copied verbatim from the manual, page 40 */}
        <>
          Place the <strong>Tesla</strong> <em>miniature (plastic)</em> on the
          Factory.
        </>
        <>Discard the top 2 cards of the Combat Card deck.</>
        <>
          Place an unused faction’s popularity token on the 16 spot on the Power
          Track. This indicates Tesla’s “health” and is not spent in combat.
        </>
        <>
          Mad Tesla is always LAST in turn order. Place the Mad Tesla Tile
          between the first and last player as a reminder, oriented with the
          rest of the board. You will use this tile for Tesla’s movement.
        </>
      </HeaderAndSteps>
      <RulesSection>
        <>
          {/* Copied from the manual, page 40 */}
          Mad Tesla is an autonomous unit that players may engage in combat
          either as an attacker or defender.
        </>
        <>
          {/* Copied from the manual, page 51 */}
          You can choose to end the game if Tesla is defeated (or someone places
          their 6th star), or you can just play until someone places their 6th
          star.
        </>
        <>
          {/* Copied from the manual, page 40 */}
          After any combat (between players or between a player and Mad Tesla),
          the attacker discards combat cards first, and then the defender
          discards. In this way, the defender’s cards will be on the top of the
          discard pile, which will matter for the next combat with Mad Tesla.
        </>
        <>Mad Tesla controls territories like any other unit.</>
        <>
          Mad Tesla forces workers to retreat back to their base like any other
          combat unit.
        </>
        <>
          Any player may initiate combat with Mad Tesla, and he may initiate
          combat with any player.
        </>
        <>
          <strong>MOVEMENT:</strong> On Mad Tesla’s turn, roll the blue
          six-sided die, placing it on the Mad Tesla Tile. Move Mad Tesla
          according to the Mad Tesla Tile. If his first movement doesn’t
          initiate combat, roll the die again and move Mad Tesla again. Stop
          there—don’t move him a third time.
        </>
        <>
          If Mad Tesla would move off the map, he returns to the Factory. This
          may initiate a combat.
        </>
        <>
          Mad Tesla is not blocked by rivers and may move onto lake territories.
        </>
        <>Mad Tesla does not use tunnels.</>
        <>
          Mad Tesla is a combat unit for the purposes of all movement and unit
          interactions.
        </>
        <>
          Mad Tesla does not interact with any tokens (Encounters, Traps,
          Influence, etc.).
        </>
        <>
          {/* copied from the manual, page 41 */}
          <strong>COMBAT AGAINST MAD TESLA</strong>
          <ol>
            <li>Gain 1 Popularity</li>
            <li>
              Set your combat dial and select combat cards as usual. a. Mad
              Tesla’s base power is equal to the top 2 cards on the combat card
              discard pile. b. Mech Mods, Infrastructure Mods, and mech
              abilities that affect an opponent’s power/combat cards do not
              apply to combat with Mad Tesla (they are marked with the icon).
              Combat abilities that affect only the player may be used, but
              there is no way to reduce Mad Tesla’s power or combat cards.
            </li>
            <li>
              Roll the orange six-sided die, placing it on the Combat slot on
              the Mad Tesla tile. Add the number on that die to Mad Tesla’s base
              power (the sum of the top 2 combat cards in the discard pile) to
              determine his total combat strength.
            </li>
            <li>Determine the winner. Attacker wins ties, as usual.</li>
          </ol>
        </>
        <>
          <strong>IF YOU LOSE:</strong> Treat it as any other combat loss, but
          in addition to you retreating, Mad Tesla also retreats (back to the
          Factory). This may initiate another combat.
        </>
        <>
          <strong>IF YOU WIN:</strong> Mad Tesla retreats to the Factory. This
          may initiate another combat, but first follow these steps to complete
          the current combat.{" "}
          <ol>
            <li>Mad Tesla retreats to the Factory.</li>
            <li>
              Gain 1 Popularity. (This is in addition to the popularity gained
              at the start of combat.)
            </li>
            <li>Place a combat star on the Triumph Track (if possible).</li>
            <li>
              Reduce Mad Tesla’s power on the Power Track by the difference
              between your totals (in the case of a tie, reduce it by 1).
            </li>
          </ol>
        </>
        <>
          In the rare case that you enter 2 combats on your turn and one of them
          is on the Factory against Mad Tesla, you must execute that combat
          first.
        </>
        <>
          If you win combat against Mad Tesla on the Factory, he retreats to an
          unoccupied adjacent territory of your choice. If all adjacent
          territories are occupied, roll the die, move Mad Tesla according to
          the Mad Tesla Tile, and he proceeds to initiate combat.
        </>
        <>
          If you reduce Mad Tesla’s power to 0, he is destroyed (removed from
          the board). You gain $10, complete your turn, and then the game ends
          immediately.
        </>
      </RulesSection>
    </>
  );
}
