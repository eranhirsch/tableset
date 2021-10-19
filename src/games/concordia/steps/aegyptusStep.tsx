import { Typography } from "@mui/material";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MapId, MAPS } from "../utils/MAPS";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "aegyptusNileFood",
  labelOverride: `${MAPS.aegyptus.name}: Nile Flooding Tile`,
  dependencies: [productsMetaStep, mapStep],
  skip: ([products, mapId]) =>
    (mapId != null && mapId !== "aegyptus") ||
    (mapId == null && !products!.includes("aegyptusCreta")),
  InstanceDerivedComponent,
});

function InstanceDerivedComponent({
  dependencies: [, mapId],
}: DerivedStepInstanceComponentProps<
  readonly ConcordiaProductId[],
  MapId
>): JSX.Element {
  return (
    <Typography variant="body1">
      {mapId == null ? (
        <>
          <em>
            If playing on the{" "}
            <strong>
              <RomanTitle>{MAPS.aegyptus.name}</RomanTitle>
            </strong>{" "}
            map
          </em>
          : p
        </>
      ) : (
        "P"
      )}
      ut a <strong>{RESOURCE_NAME.food}</strong> tile in the province{" "}
      <strong>
        <RomanTitle>Kush</RomanTitle>
      </strong>
      , resource side up; <em>Otherwise skip this step</em>.
    </Typography>
  );
}
