import { Stack, Typography, useTheme } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useHasDownstreamInstanceValue } from "features/instance/useInstanceValue";
import { PlayerId } from "features/players/playersSlice";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createItemSelectorStep } from "games/global";
import { ScytheProductId } from "../ScytheProductId";
import { Airships } from "../utils/Airships";
import advancedAirshipVariant from "./advancedAirshipVariant";
import airshipVariant from "./airshipVariant";
import productsMetaStep from "./productsMetaStep";

const airshipPassiveStep = createItemSelectorStep({
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
  getColor: () => "green",
  itemAvroType: "int",

  advancedMode: {
    enabler: advancedAirshipVariant,
    count: (playerCount) => playerCount,
  },
});
export default airshipPassiveStep;

export const airshipPassiveAssignmentStep =
  airshipPassiveStep.createAssignmentStep({
    enabler: advancedAirshipVariant,
    categoryName: "Passive Airship Ability",
    InstanceCards: AssignmentInstanceCards,
  });

function InstanceVariableComponent({
  value: tileIds,
}: VariableStepInstanceComponentProps<readonly number[]>): JSX.Element {
  return (
    <Typography variant="body1">
      Find the{" "}
      <GrammaticalList>
        {Vec.map(tileIds, (tileId) => (
          <ChosenElement color="green" extraInfo={`(${tileId + 1})`}>
            {Airships.tiles[tileId].toLocaleUpperCase()}
          </ChosenElement>
        ))}
      </GrammaticalList>{" "}
      <em>passive airship tile{tileIds.length > 1 && "s"}</em>
      {tileIds.length === 1 && (
        <>
          {" "}
          and place it near the <em>encounters deck</em>
        </>
      )}
      .
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
  value: itemIds,
  onClick,
}: InstanceCardsProps<
  readonly number[],
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean
>): JSX.Element | null {
  const hasAssignments = useHasDownstreamInstanceValue(
    airshipPassiveAssignmentStep.id
  );
  if (hasAssignments) {
    return null;
  }

  return (
    <>
      {Vec.map(itemIds, (itemId) => (
        <AirshipCard
          key={`airshipPassive_${itemId}`}
          itemId={itemId}
          onClick={onClick}
        />
      ))}
    </>
  );
}

function AssignmentInstanceCards({
  value: order,
  dependencies: [_playerIds, _productIds, _isEnabled, itemIds],
  onClick,
}: InstanceCardsProps<
  readonly PlayerId[],
  readonly PlayerId[],
  readonly ScytheProductId[],
  boolean,
  readonly number[]
>): JSX.Element {
  return (
    <>
      {Vec.map(Vec.zip(order, itemIds!), ([playerId, itemId]) => (
        <AirshipCard
          key={`airshipPassive_${playerId}_${itemId}`}
          itemId={itemId}
          playerId={playerId}
          onClick={onClick}
        />
      ))}
    </>
  );
}

function AirshipCard({
  itemId,
  playerId,
  onClick,
}: {
  itemId: number;
  playerId?: PlayerId;
  onClick(): void;
}): JSX.Element {
  const theme = useTheme();

  return (
    <InstanceCard
      title="Passive"
      subheader="Airship"
      onClick={onClick}
      playerId={playerId}
    >
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