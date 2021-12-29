import { Typography } from "@mui/material";
import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { Decks } from "../utils/Decks";
import preludeVariant from "./preludeVariant";

export default createDerivedGameStep({
  id: "prelude",
  labelOverride: "Prelude: Starting Cards",
  dependencies: [playersMetaStep, preludeVariant],
  skip: ([_playerIds, isPrelude]) => !isPrelude,
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  const isSolo = playerIds!.length === 1;
  return (
    <>
      <HeaderAndSteps>
        <>
          Shuffle all <strong>{Decks.prelude.preludes!}</strong>{" "}
          <ChosenElement extraInfo="cards">Prelude</ChosenElement>.
        </>
        <Typography variant="body1" textAlign="justify">
          {isSolo ? "Draw" : "Deal each player"} <strong>4</strong> cards.
        </Typography>
      </HeaderAndSteps>
      {!isSolo && (
        <Typography variant="body2" textAlign="justify">
          <em>Players should keep these cards hidden</em>.
        </Typography>
      )}
    </>
  );
}
