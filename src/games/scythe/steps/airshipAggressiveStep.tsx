import { Stack, Typography, useTheme } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createItemSelectorStep } from "games/global";
import { PlayerId } from "model/Player";
import { ScytheProductId } from "../ScytheProductId";
import { Airships } from "../utils/Airships";
import advancedAirshipVariant from "./advancedAirshipVariant";
import airshipVariant from "./airshipVariant";
import productsMetaStep from "./productsMetaStep";

const airshipAggressiveStep = createItemSelectorStep({
  id: "airshipAggressive",
  labelOverride: "Airship: Aggressive",

  isItemType: (x: unknown): x is number =>
    typeof x === "number" && Airships.aggressive.includes(x),

  productsMetaStep,
  enabler: airshipVariant,
  availableForProducts: () => Airships.aggressive,
  labelForId: (tileId) => Airships.tiles[tileId],
  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,
  getColor: () => "red",
  itemAvroType: "int",

  advancedMode: {
    enabler: advancedAirshipVariant,
    count: (playerCount) => playerCount,
  },
});
export default airshipAggressiveStep;

export const airshipAggressiveAssignmentStep =
  airshipAggressiveStep.createAssignmentStep({
    enabler: advancedAirshipVariant,
    categoryName: "Aggressive Airship Ability",
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

function InstanceCards({
  value: itemIds,
  onClick,
}: InstanceCardsProps<
  readonly number[],
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean
>): JSX.Element {
  const theme = useTheme();
  return (
    <>
      {Vec.map(itemIds, (itemId) => (
        <InstanceCard
          key={`airship_aggressive_${itemId}`}
          title="Aggressive"
          subheader="Airship"
          onClick={onClick}
        >
          <Stack>
            <Typography
              variant="subtitle2"
              sx={{ color: theme.palette.red.main }}
              fontSize={
                Airships.tiles[itemId].length > 15 ? "xx-small" : undefined
              }
            >
              <strong>{Airships.tiles[itemId].toLocaleUpperCase()}</strong>
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.red.main }}
            >
              ({itemId + 1})
            </Typography>
          </Stack>
        </InstanceCard>
      ))}
    </>
  );
}
