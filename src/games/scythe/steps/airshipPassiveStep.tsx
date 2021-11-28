import { Stack, Typography, useTheme } from "@mui/material";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createTrivialSingleItemSelector } from "games/global";
import { ScytheProductId } from "../ScytheProductId";
import { Airships } from "../utils/Airships";
import airshipVariant from "./airshipVariant";
import productsMetaStep from "./productsMetaStep";

export default createTrivialSingleItemSelector({
  id: "airshipPassive",
  labelOverride: "Airship: Passive",

  isItemType: (x: unknown): x is number =>
    typeof x === "number" && Airships.passive.includes(x),

  productsMetaStep,
  enabler: airshipVariant,
  availableForProducts: () => Airships.passive,
  labelForId: (tileId) => Airships.tiles[tileId],
  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,
  color: "green",
  itemAvroType: "int",
});

function InstanceVariableComponent({
  value: [tileId],
}: VariableStepInstanceComponentProps<readonly number[]>): JSX.Element {
  return (
    <Typography variant="body1">
      Find the{" "}
      <ChosenElement extraInfo={`(${tileId + 1})`}>
        {Airships.tiles[tileId]}
      </ChosenElement>{" "}
      <em>passive airship tile</em> and place it near the{" "}
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
            <strong>green</strong> circle on their back.
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

function InstanceCards({
  value: [itemId],
  dependencies: [_productIds, _isAirships],
  onClick,
}: InstanceCardsProps<
  readonly number[],
  readonly ScytheProductId[],
  boolean
>): JSX.Element {
  const theme = useTheme();
  return (
    <InstanceCard title="Passive" subheader="Airship" onClick={onClick}>
      <Stack>
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.green.main }}
        >
          <strong>{Airships.tiles[itemId].toLocaleUpperCase()}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.green.main }}>
          ({itemId + 1})
        </Typography>
      </Stack>
    </InstanceCard>
  );
}
