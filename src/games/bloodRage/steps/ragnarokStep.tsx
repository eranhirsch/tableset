import { Stack, Typography } from "@mui/material";
import { Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { useMemo } from "react";
import { Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";
import { MapGrid } from "../ux/MapGrid";

export default createRandomGameStep({
  id: "ragnarok",
  dependencies: [],
  isTemplatable: () => true,

  resolve: Ragnarok.randomIdx,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards: (props) => (
    <IndexHashInstanceCard {...props} title="Ragnarok" />
  ),

  instanceAvroType: "int",
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: ragnarokIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const ragnarokOrder = useMemo(
    () => Ragnarok.decode(ragnarokIdx),
    [ragnarokIdx]
  );
  return (
    <>
      <Typography variant="body1">
        Put the following <ChosenElement>Ragnarok Token</ChosenElement> text
        side facing on each of the three Ragnarök spots on the Age Track:
      </Typography>
      <Stack direction="column" spacing={1} textAlign="center" marginY={2}>
        {Vec.map(ragnarokOrder, (provinceId) => (
          <Typography
            key={provinceId}
            variant="subtitle1"
            sx={{ fontVariantCaps: "small-caps" }}
          >
            <strong>{Provinces.label(provinceId)}</strong>
          </Typography>
        ))}
      </Stack>
      <MapGrid
        color={(provinceId) =>
          ragnarokOrder.includes(provinceId)
            ? "red"
            : Provinces.color(provinceId)
        }
        label={(provinceId) =>
          ragnarokOrder.includes(provinceId) ? (
            <strong>Age {ragnarokOrder.indexOf(provinceId) + 1}</strong>
          ) : (
            Provinces.label(provinceId)
          )
        }
      />
      <IndexHashCaption idx={ragnarokIdx} />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  return (
    <HeaderAndSteps>
      <>
        Take the <strong>8</strong>{" "}
        <ChosenElement>Ragnarök tokens</ChosenElement>.
      </>
      <>Flip them on the side where the province name is hidden.</>
      <>Shuffle them.</>
      <>
        Place one on each of the <strong>3</strong> Ragnarök spots on the{" "}
        <ChosenElement>Age Track</ChosenElement>. The tokens should have the
        text side facing up,{" "}
        <em>
          indicating what provinces will be destroyed in the course of the game
        </em>
        .
      </>
    </HeaderAndSteps>
  );
}
