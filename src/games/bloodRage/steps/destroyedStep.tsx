import { Chip, Typography } from "@mui/material";
import { Random, Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { MapGrid } from "../ux/MapGrid";
import ragnarokStep from "./ragnarokStep";

export default createRandomGameStep({
  id: "destroyed",
  dependencies: [playersMetaStep, ragnarokStep],
  isTemplatable: (players, ragnarok) =>
    destroyedPerPlayerCount(players.onlyResolvableValue()!.length) > 0 &&
    ragnarok.willResolve(),

  resolve: (_, playerIds, ragnarokProvinceIds) =>
    ragnarokProvinceIds != null
      ? Random.sample(
          Vec.diff(Provinces.ids, ragnarokProvinceIds),
          destroyedPerPlayerCount(playerIds!.length)
        )
      : null,

  skip: (_, [playerIds]) => destroyedPerPlayerCount(playerIds!.length) === 0,

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,

  instanceAvroType: {
    type: "array",
    items: Provinces.avroType("DestroyedProvinceId"),
  },
  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: destroyedProvinceIds,
}: VariableStepInstanceComponentProps<readonly ProvinceId[]>): JSX.Element {
  return (
    <>
      <Typography variant="body1">
        Before the game begins, some provinces will already have been destroyed
        by Ragnarök, leaving less usable space on the board. Place the following{" "}
        <ChosenElement>
          Ragnarok Token{destroyedProvinceIds.length > 1 && "s"}
        </ChosenElement>{" "}
        on the province{destroyedProvinceIds.length > 1 && "s"}, with the
        “destroyed” side facing up.
      </Typography>
      <MapGrid
        color={(provinceId) =>
          destroyedProvinceIds.includes(provinceId)
            ? "red"
            : Provinces.color(provinceId)
        }
        label={(provinceId) =>
          destroyedProvinceIds.includes(provinceId) ? (
            <strong>{Provinces.label(provinceId)}</strong>
          ) : undefined
        }
      />
    </>
  );
}

function InstanceCards({
  value: destroyedProvinceIds,
  onClick,
}: InstanceCardsProps<readonly ProvinceId[]>): JSX.Element {
  return (
    <>
      {Vec.map(destroyedProvinceIds, (provinceId) => (
        <InstanceCard
          key={`destroyed_${provinceId}`}
          onClick={onClick}
          title="Destroyed"
        >
          <Typography variant="h5">🔥</Typography>
          <Chip
            sx={{ width: "100%" }}
            label={Provinces.label(provinceId)}
            color={Provinces.color(provinceId)}
          />
        </InstanceCard>
      ))}
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const ragnarokProvinceIds = useOptionalInstanceValue(ragnarokStep);

  const numTokens = destroyedPerPlayerCount(playerIds.length);

  return (
    <HeaderAndSteps synopsis="Before the game begins, some provinces will already have been destroyed by Ragnarök, leaving less usable space on the board:">
      {ragnarokProvinceIds != null && (
        <>
          Take the remaining <strong>5</strong>{" "}
          <ChosenElement>Ragnarök tokens</ChosenElement>.
        </>
      )}
      {ragnarokProvinceIds != null && (
        <>Flip them on the side where the province name is hidden.</>
      )}
      {ragnarokProvinceIds != null && <>Shuffle them.</>}
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

export const destroyedPerPlayerCount = (playerCount: number): number =>
  5 - playerCount;
