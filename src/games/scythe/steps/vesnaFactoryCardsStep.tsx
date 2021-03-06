import { Typography } from "@mui/material";
import { $, MathUtils, nullthrows, Random, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { PlayerAvatar } from "features/players/PlayerAvatar";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { useMemo } from "react";
import { FactoryCards } from "../utils/FactoryCards";
import { HomeBases } from "../utils/HomeBases";
import { FactionChip } from "../ux/FactionChip";
import factionsStep from "./factionsStep";
import modularBoardVariant from "./modularBoardVariant";
import modularHomeBasesStep from "./modularHomeBasesStep";
import playerAssignmentsStep from "./playerAssignmentsStep";
import productsMetaStep from "./productsMetaStep";

export default createRandomGameStep({
  id: "vesnaFactoryCards",
  labelOverride: "Vesna: Technopile",

  dependencies: [
    productsMetaStep,
    factionsStep,
    modularBoardVariant,
    modularHomeBasesStep,
  ],

  isTemplatable: (products, factions, isModular, _homeBases) =>
    products.willContain("fenris")! &&
    ((isModular.canResolveTo(false) &&
      (!factions.willResolve() || factions.willContain("vesna") !== false)) ||
      // TODO: homeBases returns a `number`, not an array of HomeBaseIds, so we
      // can't query if it will contain vesna or not, for now we simply don't
      // perform this optimization, in the future if we can query on a different
      // type than the actual step instance type we can change this...
      isModular.canResolveTo(true)),

  resolve(_, productIds, factionIds, _isModular, homeBasesIdx) {
    if (factionIds != null && !factionIds.includes("vesna")) {
      return null;
    }

    if (
      homeBasesIdx != null &&
      !HomeBases.decode(homeBasesIdx).includes("vesna")
    ) {
      return null;
    }

    return $(
      productIds!.includes("promo4"),
      ($$) => ($$ ? FactoryCards.ALL_IDS : FactoryCards.BASE_IDS),
      ($$) => Random.sample($$, 3),
      ($$) =>
        MathUtils.combinations_lazy_array(FactoryCards.ALL_IDS, 3).indexOf($$)
    );
  },

  skip: (_, [products, factionIds, _isModular, homeBasesIdx]) =>
    !products!.includes("fenris") ||
    (factionIds != null && !factionIds.includes("vesna")) ||
    (homeBasesIdx != null && !HomeBases.decode(homeBasesIdx).includes("vesna")),

  InstanceVariableComponent,
  InstanceManualComponent,
  // We are intentionally not providing instance cards for the results so that
  // if players haven't selected the Vesna faction yet (like in the modular
  // board) they shouldn't have this information available.
  InstanceCards: (props) => (
    <IndexHashInstanceCard title="Technopile" subheader="Vesna" {...props} />
  ),

  ...NoConfigPanel,

  instanceAvroType: "int",
});

function InstanceVariableComponent({
  value: cardsIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const factionIds = useOptionalInstanceValue(factionsStep);
  const assignments = useOptionalInstanceValue(playerAssignmentsStep);

  const factoryCards = useMemo(
    () =>
      nullthrows(
        MathUtils.combinations_lazy_array(FactoryCards.ALL_IDS, 3).at(cardsIdx),
        `Index ${cardsIdx} out of range!`
      ),
    [cardsIdx]
  );

  return (
    <Typography variant="body1">
      {factionIds != null ? (
        assignments != null ? (
          <PlayerAvatar
            playerId={assignments[factionIds.indexOf("vesna")]}
            inline
          />
        ) : (
          <>
            The player with <FactionChip factionId="vesna" inline />
          </>
        )
      ) : (
        <>
          <em>
            If playing with <FactionChip factionId="vesna" inline />
          </em>
          : That player
        </>
      )}{" "}
      takes <em>Factory</em> cards{" "}
      <GrammaticalList>
        {Vec.map(factoryCards, (cardIdx) => (
          <ChosenElement key={`factoryCard_${cardIdx}`}>
            {cardIdx + 1}
          </ChosenElement>
        ))}
      </GrammaticalList>{" "}
      and puts them next to their player mat.
    </Typography>
  );
}

function InstanceManualComponent(): JSX.Element {
  const productIds = useRequiredInstanceValue(productsMetaStep);
  const factionIds = useOptionalInstanceValue(factionsStep);
  const assignments = useOptionalInstanceValue(playerAssignmentsStep);

  return (
    <HeaderAndSteps
      synopsis={
        <>
          {factionIds != null ? (
            assignments != null ? (
              <PlayerAvatar
                playerId={assignments[factionIds.indexOf("vesna")]}
                inline
              />
            ) : (
              <>
                The player with <FactionChip factionId="vesna" inline />
              </>
            )
          ) : (
            <>
              <em>
                If playing with <FactionChip factionId="vesna" inline />
              </em>
              : That player
            </>
          )}{" "}
          sets up the <em>Technophile</em> vesna faction ability:
        </>
      }
    >
      <BlockWithFootnotes
        footnote={
          <>
            Large cards with a purple back, numbered in sequence (at the upper
            right corner of the card) starting from 1 to{" "}
            {
              FactoryCards[
                productIds!.includes("promo4") ? "ALL_IDS" : "BASE_IDS"
              ].length
            }
            .
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all factory cards
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Draw <strong>3</strong> cards.
      </>
      <>Put the cards next to their player mat.</>
    </HeaderAndSteps>
  );
}