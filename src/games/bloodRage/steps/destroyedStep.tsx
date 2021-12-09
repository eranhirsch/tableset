import { Typography } from "@mui/material";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { playersMetaStep } from "games/global";
import { useMemo } from "react";
import { Destroyed } from "../utils/Destroyed";
import { Provinces } from "../utils/Provinces";
import { MapGrid } from "../ux/MapGrid";
import ragnarokStep from "./ragnarokStep";

export default createRandomGameStep({
  id: "destroyed",
  dependencies: [playersMetaStep, ragnarokStep],
  isTemplatable: (players, ragnarok) =>
    Destroyed.perPlayerCount(players.onlyResolvableValue()!.length) > 0 &&
    ragnarok.willResolve(),

  resolve: (_, playerIds, ragnarokIdx) =>
    ragnarokIdx != null
      ? Destroyed.randomIdx(playerIds!.length, ragnarokIdx)
      : null,

  skip: (_, [playerIds]) => Destroyed.perPlayerCount(playerIds!.length) === 0,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Destroyed" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: destroyedIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const ragnarokIdx = useRequiredInstanceValue(ragnarokStep);

  const destroyed = useMemo(
    () => Destroyed.decode(destroyedIdx, playerIds.length, ragnarokIdx),
    [destroyedIdx, playerIds.length, ragnarokIdx]
  );

  return (
    <>
      <Typography variant="body1">
        Before the game begins, some provinces will already have been destroyed
        by Ragnarök, leaving less usable space on the board. Place the following{" "}
        <ChosenElement>
          Ragnarok Token{destroyed.length > 1 && "s"}
        </ChosenElement>{" "}
        on the province{destroyed.length > 1 && "s"}, with the “destroyed” side
        facing up.
      </Typography>
      <MapGrid
        color={(provinceId) =>
          destroyed.includes(provinceId) ? "red" : Provinces.color(provinceId)
        }
        label={(provinceId) =>
          destroyed.includes(provinceId) ? (
            <strong>{Provinces.label(provinceId)}</strong>
          ) : undefined
        }
      />
      <IndexHashCaption idx={destroyedIdx} />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const ragnarokIdx = useOptionalInstanceValue(ragnarokStep);

  const numTokens = Destroyed.perPlayerCount(playerIds.length);

  return (
    <HeaderAndSteps synopsis="Before the game begins, some provinces will already have been destroyed by Ragnarök, leaving less usable space on the board:">
      {ragnarokIdx != null && (
        <>
          Take the remaining <strong>5</strong>{" "}
          <ChosenElement>Ragnarök tokens</ChosenElement>.
        </>
      )}
      {ragnarokIdx != null && (
        <>Flip them on the side where the province name is hidden.</>
      )}
      {ragnarokIdx != null && <>Shuffle them.</>}
      <>
        Take <strong>{numTokens}</strong> Ragnarök tokens.
      </>
      <>
        Place {numTokens > 1 ? "them" : "it"} on the province
        {numTokens > 1 && "s"} indicated on {numTokens > 1 ? "them" : "it"},
        with the “destroyed” side facing up.
      </>
    </HeaderAndSteps>
  );
}
