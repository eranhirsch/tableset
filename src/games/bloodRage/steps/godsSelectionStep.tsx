import { Chip, Typography } from "@mui/material";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createItemSelectorStep } from "games/global";
import { GodId, Gods } from "../utils/Gods";
import godsVariant from "./godsVariant";
import productsMetaStep from "./productsMetaStep";

export default createItemSelectorStep({
  id: "godsSelection",
  productsMetaStep,
  enabler: godsVariant,
  isItemType: Gods.isType,
  availableForProducts: (productIds) =>
    productIds.includes("gods") ? Gods.ids : [],
  labelForId: Gods.label,
  getColor: Gods.color,
  count: () => Gods.PER_GAME,
  itemAvroType: Gods.avroType,
  InstanceCards,
  InstanceVariableComponent,
  InstanceManualComponent,
});

function InstanceCards({
  value: godIds,
  onClick,
}: InstanceCardsProps<readonly GodId[]>): JSX.Element {
  return (
    <>
      {Vec.map(godIds, (godId) => (
        <InstanceCard
          key={godId}
          onClick={onClick}
          subheader="Gods"
          title="Selection"
        >
          <Chip color={Gods.color(godId)} label={Gods.label(godId)} />
        </InstanceCard>
      ))}
    </>
  );
}

function InstanceVariableComponent({
  value: godIds,
}: VariableStepInstanceComponentProps<readonly GodId[]>): JSX.Element {
  return (
    <Typography variant="body1">
      Place the <ChosenElement>god cards</ChosenElement> of{" "}
      <GrammaticalList>
        {Vec.map(godIds, (godId) => (
          <Chip
            size="small"
            color={Gods.color(godId)}
            label={Gods.label(godId)}
          />
        ))}
      </GrammaticalList>{" "}
      next to the board, where all players can see them.
    </Typography>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      <>
        Shuffle the <strong>{Gods.ids.length}</strong>{" "}
        <ChosenElement>God Cards</ChosenElement>
      </>
      <>
        Randomly draw <strong>{Gods.PER_GAME}</strong> of them.{" "}
        <em>Only {Gods.PER_GAME} gods are used during each game session</em>.
      </>
      <>Return the remaining god cards to the box.</>
      <>
        Place the {Gods.PER_GAME} selected god cards next to the board, where
        all players can see them.
      </>
    </HeaderAndSteps>
  );
}