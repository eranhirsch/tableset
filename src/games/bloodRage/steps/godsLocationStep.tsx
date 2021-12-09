import { Chip, Typography } from "@mui/material";
import { $, Random, Vec } from "common";
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
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { playersMetaStep } from "games/global";
import { Destroyed } from "../utils/Destroyed";
import { Gods } from "../utils/Gods";
import { ProvinceId, Provinces } from "../utils/Provinces";
import { Ragnarok } from "../utils/Ragnarok";
import { MapGrid } from "../ux/MapGrid";
import destroyedStep from "./destroyedStep";
import godsSelectionStep from "./godsSelectionStep";
import godsVariant from "./godsVariant";
import ragnarokStep from "./ragnarokStep";

export default createRandomGameStep({
  id: "godsLocation",
  dependencies: [playersMetaStep, godsVariant, ragnarokStep, destroyedStep],

  isTemplatable: (_, isEnabled, ragnarok, destroyed) =>
    isEnabled && ragnarok.willResolve() && destroyed.willResolve(),

  resolve: (_, playerIds, isEnabled, ragnarokIdx, destroyedIdx) =>
    isEnabled
      ? $(
          Provinces.ids,
          ($$) => Vec.diff($$, Ragnarok.decode(ragnarokIdx!)),
          ($$) =>
            Vec.diff(
              $$,
              Destroyed.decode(destroyedIdx!, playerIds!.length, ragnarokIdx!)
            ),
          ($$) => Random.sample($$, Gods.PER_GAME),
          Random.shuffle
        )
      : null,
  skip: (_value, [_playerIds, isEnabled]) => !isEnabled,

  instanceAvroType: { type: "array", items: Provinces.avroType },

  InstanceVariableComponent,
  InstanceManualComponent,
  InstanceCards,

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: godProvinceIds,
}: VariableStepInstanceComponentProps<readonly ProvinceId[]>): JSX.Element {
  const godIds = useOptionalInstanceValue(godsSelectionStep);

  return (
    <>
      <Typography variant="body1">
        Take the <ChosenElement>God figures</ChosenElement>{" "}
        {godIds == null && "corresponding to the cards drawn"} and place them in
        their starting provinces;{" "}
        <em>
          the god figures never occupy any villages; they are simply placed
          inside the indicated province area
        </em>
        .
      </Typography>
      <MapGrid
        color={(provinceId) =>
          !godProvinceIds.includes(provinceId)
            ? undefined
            : godIds != null
            ? Gods.color(godIds[godProvinceIds.indexOf(provinceId)])
            : "black"
        }
        label={(provinceId) =>
          !godProvinceIds.includes(provinceId) ? undefined : (
            <strong>
              {godIds != null
                ? Gods.label(godIds[godProvinceIds.indexOf(provinceId)])
                : `God ${godProvinceIds.indexOf(provinceId) + 1}`}
            </strong>
          )
        }
      />
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const godIds = useOptionalInstanceValue(godsSelectionStep);

  return (
    <HeaderAndSteps>
      <>
        Take all{" "}
        <strong>{5 - Destroyed.perPlayerCount(playerIds.length)}</strong>{" "}
        leftover Ragnarok tokens that were returned to the box (the ones that
        are neither on the Game Board nor on the Age Track).
      </>
      <>Shuffle them.</>
      <>
        Draw <strong>2</strong> tiles, 1 for each of the 2 gods
        {godIds != null && (
          <>
            :{" "}
            <GrammaticalList>
              {Vec.map(godIds, (godId) => (
                <Chip
                  key={godId}
                  size="small"
                  color={Gods.color(godId)}
                  label={Gods.label(godId)}
                />
              ))}
            </GrammaticalList>
          </>
        )}
        .
      </>
      <>Place the god figure in the province indicated on the token.</>
      <>Return the Ragnarok tokens to the box without eny effect.</>
    </HeaderAndSteps>
  );
}

function InstanceCards({
  value: godProvinceId,
  onClick,
}: InstanceCardsProps<readonly ProvinceId[]>): JSX.Element {
  return (
    <>
      {Vec.map(godProvinceId, (provinceId, index) => (
        <InstanceCard
          key={provinceId}
          onClick={onClick}
          title="Provinces"
          subheader="Gods"
        >
          <Chip
            size="small"
            color={Provinces.color(provinceId)}
            label={Provinces.label(provinceId)}
          />
        </InstanceCard>
      ))}
    </>
  );
}
