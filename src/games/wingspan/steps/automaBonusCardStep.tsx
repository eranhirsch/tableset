import { Typography } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createItemSelectorStep } from "games/global";
import React from "react";
import BirdName from "../ux/BirdName";
import automaOnlyBonusCardsVariant from "./automaOnlyBonusCardsVariant";
import productsMetaStep from "./productsMetaStep";

const ALL_AUTOMA_ONLY_BONUS_CARD_IDS = ["autwitcher", "lifeFellow"] as const;
type AutomaOnlyBonusCardId = typeof ALL_AUTOMA_ONLY_BONUS_CARD_IDS[number];

const AUTOMA_ONLY_BONUS_CARD_LABELS: Readonly<
  Required<Record<AutomaOnlyBonusCardId, string>>
> = {
  autwitcher: "Autwitcher",
  lifeFellow: "RASPB Life Fellow",
};

export default createItemSelectorStep({
  id: "automaBonusCard",
  labelOverride: "Automa: Bonus Card",
  enabler: automaOnlyBonusCardsVariant,
  productsMetaStep,
  availableForProducts: (productIds) =>
    productIds.includes("europe") ? ALL_AUTOMA_ONLY_BONUS_CARD_IDS : [],
  isItemType: (x: unknown): x is AutomaOnlyBonusCardId =>
    typeof x === "string" &&
    ALL_AUTOMA_ONLY_BONUS_CARD_IDS.includes(x as AutomaOnlyBonusCardId),
  itemAvroType: {
    type: "enum",
    name: "AutomaOnlyBonusCardId",
    symbols: [...ALL_AUTOMA_ONLY_BONUS_CARD_IDS],
  },
  labelForId: (cardId) => AUTOMA_ONLY_BONUS_CARD_LABELS[cardId],
  count: () => 1,
  InstanceVariableComponent,
  InstanceCards,
  skipManualWhenDisabled: false,
  InstanceManualComponent,
});

function InstanceVariableComponent({
  value: [cardId],
}: VariableStepInstanceComponentProps<
  readonly AutomaOnlyBonusCardId[]
>): JSX.Element {
  return (
    <Typography variant="body1" textAlign="justify">
      Use the{" "}
      <ChosenElement extraInfo="Automa-only bonus card">
        {AUTOMA_ONLY_BONUS_CARD_LABELS[cardId]}
      </ChosenElement>
      .
    </Typography>
  );
}

function InstanceCards({
  value: [cardId],
  onClick,
}: InstanceCardsProps<readonly AutomaOnlyBonusCardId[]>): JSX.Element {
  return (
    <InstanceCard title="Bonus" subheader="Automa" onClick={onClick}>
      <Typography variant="subtitle1" color="primary">
        <strong>{AUTOMA_ONLY_BONUS_CARD_LABELS[cardId]}</strong>
      </Typography>
    </InstanceCard>
  );
}

function InstanceManualComponent(): JSX.Element {
  const isAutomaOnlyCards = useRequiredInstanceValue(
    automaOnlyBonusCardsVariant
  );
  if (isAutomaOnlyCards) {
    return (
      <Typography variant="body1" textAlign="justify">
        Chose either{" "}
        <GrammaticalList finalConjunction="or">
          {React.Children.toArray(
            Vec.map(Vec.values(AUTOMA_ONLY_BONUS_CARD_LABELS), (cardName) => (
              <BirdName>{cardName}</BirdName>
            ))
          )}
        </GrammaticalList>{" "}
        as the bonus card for the Automa.
      </Typography>
    );
  }

  return (
    <HeaderAndSteps>
      <>
        Draw and reveal a <ChosenElement extraInfo="card">Bonus</ChosenElement>{" "}
        for the Automa.
      </>
      <>
        If the bonus card is <BirdName>Breeding Manager</BirdName>,{" "}
        <BirdName>Backyard Birder</BirdName>, or if it does not show{" "}
        <strong>(X% of cards)</strong> at the bottom of the card, return it to
        the deck and select another.
        <br />
        <em>Repeat if necessary.</em>
      </>
      <>Reshuffle the bonus deck before continuing with setup.</>
    </HeaderAndSteps>
  );
}
