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
          <ChosenElement color="red" extraInfo={`(${tileId + 1})`}>
            {Airships.tiles[tileId].toLocaleUpperCase()}
          </ChosenElement>
        ))}
      </GrammaticalList>{" "}
      <em>aggressive airship tile{tileIds.length > 1 && "s"}</em>
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
>): JSX.Element | null {
  const hasAssignments = useHasDownstreamInstanceValue(
    airshipAggressiveAssignmentStep.id
  );
  if (hasAssignments) {
    return null;
  }

  return (
    <>
      {Vec.map(itemIds, (itemId) => (
        <AirshipCard
          key={`airshipAggressive_${itemId}`}
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
          key={`airshipAggressive_${playerId}_${itemId}`}
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
  onClick(): void;
  itemId: number;
  playerId?: PlayerId;
}): JSX.Element {
  const theme = useTheme();

  return (
    <InstanceCard
      title="Aggress."
      subheader="Airship"
      playerId={playerId}
      onClick={onClick}
    >
      <Stack>
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.red.main }}
          fontSize={Airships.tiles[itemId].length > 15 ? "xx-small" : undefined}
        >
          <strong>{Airships.tiles[itemId].toLocaleUpperCase()}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: theme.palette.red.main }}>
          ({itemId + 1})
        </Typography>
      </Stack>
    </InstanceCard>
  );
}
