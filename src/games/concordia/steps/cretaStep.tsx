import { Typography } from "@mui/material";
import {
  createDerivedGameStep,
  DerivedStepInstanceComponentProps,
} from "games/core/steps/createDerivedGameStep";
import { ConcordiaProductId } from "../ConcordiaProductId";
import { MapId, MAPS } from "../utils/MAPS";
import RomanTitle from "../ux/RomanTitle";
import mapStep from "./mapStep";
import productsMetaStep from "./productsMetaStep";

export default createDerivedGameStep({
  id: "cretaBonusTiles",
  labelOverride: `${MAPS.creta.name}: Bonus Tiles`,
  dependencies: [productsMetaStep, mapStep],
  skip: ([products, mapId]) =>
    (mapId != null && mapId !== "creta") ||
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
              <RomanTitle>{MAPS.creta.name}</RomanTitle>
            </strong>{" "}
            map
          </em>
          : p
        </>
      ) : (
        "P"
      )}
      ut 1 tile of each resource type (5 total), resource side up, near the
      minimap. These will be used when producing in the brown province (with{" "}
      <RomanTitle>
        {/* spell-checker: disable */}Gavdos{/* spell-checker: enable */}
      </RomanTitle>
      )
      {mapId == null && (
        <>
          ; <em>Otherwise skip this step</em>
        </>
      )}
      .
    </Typography>
  );
}
