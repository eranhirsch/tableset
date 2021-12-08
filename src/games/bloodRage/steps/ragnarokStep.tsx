import { Stack, Typography } from "@mui/material";
import { Vec } from "common";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { useMemo } from "react";
import { Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";

export default createRandomGameStep({
  id: "ragnarok",
  dependencies: [],
  isTemplatable: () => true,

  resolve: Ragnarok.randomIdx,

  InstanceVariableComponent,
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
            variant="subtitle1"
            sx={{ fontVariantCaps: "small-caps" }}
          >
            <strong>{Provinces.label(provinceId)}</strong>
          </Typography>
        ))}
      </Stack>
      <IndexHashCaption idx={ragnarokIdx} />
    </>
  );
}
