import { Chip, Stack, Typography } from "@mui/material";
import { Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { MapGrid } from "../ux/MapGrid";

const NUM_AGES = 3;

export default createRandomGameStep({
  id: "ragnarok",
  dependencies: [],
  isTemplatable: () => true,

  resolve: () => Random.shuffle(Random.sample(Provinces.ids, NUM_AGES)),

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,

  instanceAvroType: { type: "array", items: Provinces.avroType('RagnarokProvinceId') },
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: provinceIds,
}: VariableStepInstanceComponentProps<readonly ProvinceId[]>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Put the following <ChosenElement>Ragnarok Token</ChosenElement> text
        side facing on each of the three Ragnarök spots on the Age Track:
      </Typography>
      <Stack direction="column" spacing={1} textAlign="center" marginY={2}>
        {Vec.map(provinceIds, (provinceId) => (
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
          provinceIds.includes(provinceId) ? "red" : Provinces.color(provinceId)
        }
        label={(provinceId) =>
          provinceIds.includes(provinceId) ? (
            <strong>Age {provinceIds.indexOf(provinceId) + 1}</strong>
          ) : (
            Provinces.label(provinceId)
          )
        }
      />
    </>
  );
}

function InstanceCards({
  value: provinceIds,
  onClick,
}: InstanceCardsProps<readonly ProvinceId[]>): JSX.Element {
  return (
    <>
      {Vec.map(provinceIds, (provinceId, index) => (
        <InstanceCard
          key={`ragnarok_${provinceId}`}
          onClick={onClick}
          title={`Age ${index + 1}`}
          subheader="Ragnarok"
        >
          <Chip
            label={Provinces.label(provinceId)}
            color={Provinces.color(provinceId)}
          />
        </InstanceCard>
      ))}
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
        Place one on each of the <strong>{NUM_AGES}</strong> Ragnarök spots on
        the <ChosenElement>Age Track</ChosenElement>. The tokens should have the
        text side facing up,{" "}
        <em>
          indicating what provinces will be destroyed in the course of the game
        </em>
        .
      </>
    </HeaderAndSteps>
  );
}
