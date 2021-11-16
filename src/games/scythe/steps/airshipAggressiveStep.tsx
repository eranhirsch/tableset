import { Typography } from "@mui/material";
import { VariableStepInstanceComponentProps } from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createTrivialSingleItemSelector } from "games/global";
import { Airships } from "../utils/Airships";
import airshipVariant from "./airshipVariant";
import productsMetaStep from "./productsMetaStep";

export default createTrivialSingleItemSelector({
  id: "airshipAggressive",
  labelOverride: "Airship: Aggressive Ability",
  productsMetaStep,
  variantStep: airshipVariant,
  availableForProducts: () => Airships.aggressive,
  labelForId: (tileId) => Airships.tiles[tileId],
  InstanceVariableComponent,
  InstanceManualComponent,
});

function InstanceVariableComponent({
  value: tileId,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  return (
    <Typography variant="body1">
      Find the <ChosenElement>{Airships.tiles[tileId]}</ChosenElement>{" "}
      <em>aggressive airship tile</em> and place it near the{" "}
      <em>encounters deck</em>.
    </Typography>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Pick a <em>global</em> passive ability for all airships:
        </>
      }
    >
      <BlockWithFootnotes
        footnote={
          <>
            {Airships.passive.length} large thick cardboard tiles with a{" "}
            <strong>red</strong> circle on their back.
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all airship passive ability tiles
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Draw <strong>1</strong> tile randomly and place it face-up near the
        encounters deck.
      </>
    </HeaderAndSteps>
  );
}