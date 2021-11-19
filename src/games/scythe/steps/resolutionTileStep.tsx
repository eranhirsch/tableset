import { Box } from "@mui/material";
import { Vec } from "common";
import { VariableStepInstanceComponentProps } from "games/core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createTrivialSingleItemSelector } from "games/global";
import productsMetaStep from "./productsMetaStep";
import resolutionVariant from "./resolutionVariant";


const MISSION_POSSIBLE = "Mission Possible";
const RESOLUTION_TILES = [
  "Land Rush",
  "Factory Explosion",
  "Spoils of War",
  "King of the Hill",
  "Deja Vu",
  MISSION_POSSIBLE,
  "Doomsday Clock",
  "Backup Plan",
] as const;
export const MISSION_POSSIBLE_ID = RESOLUTION_TILES.indexOf(MISSION_POSSIBLE);

export default createTrivialSingleItemSelector({
  id: "resolution",

  isType: (x: unknown): x is number =>
    typeof x === "number" && x < RESOLUTION_TILES.length,

  productsMetaStep,

  variantStep: resolutionVariant,

  availableForProducts: (productIds) =>
    productIds.includes("windGambit")
      ? Vec.range(0, RESOLUTION_TILES.length - 1)
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
      <ChosenElement extraInfo={`(${index + 1})`}>
        {RESOLUTION_TILES[index]}
      </ChosenElement>{" "}
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
