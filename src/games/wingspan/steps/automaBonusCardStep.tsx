import { Typography } from "@mui/material";
import { Vec } from "common";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import React from "react";
import BirdName from "../ux/BirdName";
import automaOnlyBonusCardsVariant from "./automaOnlyBonusCardsVariant";

const ALL_AUTOMA_ONLY_BONUS_CARD_IDS = ["autwitcher", "lifeFellow"] as const;
type AutomaOnlyBonusCardId = typeof ALL_AUTOMA_ONLY_BONUS_CARD_IDS[number];

const AUTOMA_ONLY_BONUS_CARD_LABELS: Readonly<
  Required<Record<AutomaOnlyBonusCardId, string>>
> = {
  autwitcher: "Autwitcher",
  lifeFellow: "RASPB Life Fellow",
};

export default createDerivedGameStep({
  id: "automaBonusCard",
  labelOverride: "Automa: Bonus Card",
  dependencies: [playersMetaStep, automaOnlyBonusCardsVariant],
  skip: ([playerIds, _isAutomaOnlyCards]) => playerIds!.length > 1,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds, isAutomaOnlyCards],
}: DerivedStepInstanceComponentProps<
  readonly PlayerId[],
  boolean
>): JSX.Element {
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
