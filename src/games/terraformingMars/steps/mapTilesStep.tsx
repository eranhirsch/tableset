import { PlayerId } from "features/players/playersSlice";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";

export default createDerivedGameStep({
  id: "mapTiles",
  dependencies: [playersMetaStep],
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [playerIds],
}: DerivedStepInstanceComponentProps<readonly PlayerId[]>): JSX.Element {
  return (
    <HeaderAndSteps
      synopsis={
        <>
          Create piles for the map tiles
          {playerIds!.length > 1 && <> so that everyone can reach them</>}:
        </>
      }
    >
      <>
        <strong>60</strong>{" "}
        <ChosenElement extraInfo="tiles">Greenery/City</ChosenElement>
      </>
      <>
        <strong>11</strong>{" "}
        <ChosenElement extraInfo="tiles">Special</ChosenElement>
      </>
    </HeaderAndSteps>
  );
}
