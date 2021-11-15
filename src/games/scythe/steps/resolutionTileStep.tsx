import { Box, Typography } from "@mui/material";
import { Vec } from "common";
import { VariableStepInstanceComponentProps } from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createTrivialSingleItemSelector } from "games/global";
import productsMetaStep from "./productsMetaStep";
import resolutionVariant from "./resolutionVariant";

const RESOLUTION_TILES = [
  // skip this, it's just here to make the array 1-based to match the cards
  "__ERROR",

  "Land Rush",
  "Factory Explosion",
  "Spoils of War",
  "King of the Hill",
  "Deja Vu",
  "Mission Possible",
  "Doomsday Clock",
  "Backup Plan",
] as const;

export default createTrivialSingleItemSelector({
  id: "resolution",

  productsMetaStep,

  variantStep: resolutionVariant,

  availableForProducts: (productIds) =>
    productIds.includes("windGambit")
      ? Vec.range(1, RESOLUTION_TILES.length - 1)
      : [],

  labelForId: (resolutionId) => RESOLUTION_TILES[resolutionId],

  InstanceVariableComponent,
  InstanceManualComponent,
});

function InstanceVariableComponent({
  value: index,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  return (
    <Box>
      Place the{" "}
      <Typography component="span" color="primary">
        <strong>{RESOLUTION_TILES[index]}</strong>
      </Typography>{" "}
      <em>resolution</em> tile face-up near the triumph track.
    </Box>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps synopsis="Assign a structure bonus:">
      <BlockWithFootnotes
        footnote={
          <>
            {RESOLUTION_TILES.length} thick cardboard tiles with a black
            background and a royal seal on their back.
          </>
        }
      >
        {(Footnote) => (
          <>
            Shuffle all resolution tiles
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Draw <strong>1</strong> tile randomly.
      </>
      <>Put the tile face-up near the triumph track.</>
    </HeaderAndSteps>
  );
}
