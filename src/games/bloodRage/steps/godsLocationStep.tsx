import { Typography } from "@mui/material";
import { $, Random, Vec } from "common";
import { useOptionalInstanceValue } from "features/instance/useInstanceValue";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { ChosenElement } from "games/core/ux/ChosenElement";
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

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: godProvinceIds,
}: VariableStepInstanceComponentProps<readonly ProvinceId[]>): JSX.Element {
  const godIds = useOptionalInstanceValue(godsSelectionStep);

  return (
    <>
      <Typography variant="body1">
        Take the <ChosenElement>god figure</ChosenElement> and place them in
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
            : "primary"
        }
        label={(provinceId) =>
          !godProvinceIds.includes(provinceId)
            ? undefined
            : godIds != null
            ? Gods.label(godIds[godProvinceIds.indexOf(provinceId)])
            : Provinces.label(provinceId)
        }
      />
    </>
  );
}
