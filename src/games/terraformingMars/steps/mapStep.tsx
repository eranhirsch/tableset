import { Chip, Stack, Typography } from "@mui/material";
import { ColorId } from "app/utils/Colors";
import { Vec } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { useRequiredInstanceValue } from "features/instance/useInstanceValue";
import {
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { createItemSelectorStep } from "games/global";
import { RulesSection } from "games/global/ux/RulesSection";
import { useState } from "react";
import productsMetaStep, {
  TerraformingMarsProductId,
} from "./productsMetaStep";

const ALL_MAP_IDS = ["tharsis", "hellas", "elysium"] as const;
type MapId = typeof ALL_MAP_IDS[number];

interface Map {
  name: string;
  color: ColorId;
}
const MAPS: Readonly<Required<Record<MapId, Map>>> = {
  elysium: { name: "Elysium", color: "green" },
  hellas: { name: "Hellas", color: "blue" },
  tharsis: { name: "Tharsis", color: "orange" },
};

export default createItemSelectorStep({
  id: "map",

  productsMetaStep,
  availableForProducts,
  labelForId: (mapId) => MAPS[mapId].name,
  getColor: (mapId) => MAPS[mapId].color,
  isItemType: (x: unknown): x is MapId =>
    typeof x === "string" && ALL_MAP_IDS.includes(x as MapId),

  count: () => 1,

  InstanceCards,
  InstanceVariableComponent,
  InstanceManualComponent,

  itemAvroType: { type: "enum", name: "MapId", symbols: [...ALL_MAP_IDS] },
});

function InstanceCards({
  value: [mapId],
  onClick,
}: InstanceCardsProps<readonly MapId[]>): JSX.Element {
  const { color, name } = MAPS[mapId];
  return (
    <InstanceCard onClick={onClick} title="Map">
      <Chip color={color} label={name} />
    </InstanceCard>
  );
}

function InstanceVariableComponent({
  value: [mapId],
}: VariableStepInstanceComponentProps<readonly MapId[]>): JSX.Element {
  const { name, color } = MAPS[mapId];
  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Place the <Chip color={color} label={name} /> map centrally on the
        table.
      </Typography>
      <RulesSection>
        {mapId === "tharsis" ? (
          <TharsisRules />
        ) : mapId === "hellas" ? (
          <HellasRules />
        ) : (
          <ElysiumRules />
        )}
      </RulesSection>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const [rulesForMap, setRulesForMap] = useState<MapId>("tharsis");
  const productIds = useRequiredInstanceValue(productsMetaStep);

  const numMaps = availableForProducts(productIds).length;

  if (numMaps === 1) {
    return (
      <>
        <Typography variant="body1" textAlign="justify">
          {/* Copied from the manual verbatim */}
          Place the <ChosenElement>game board</ChosenElement> centrally on the
          table.
        </Typography>
        <RulesSection>
          <TharsisRules />
        </RulesSection>
      </>
    );
  }

  return (
    <>
      <Typography variant="body1" textAlign="justify">
        Pick one of the {numMaps} <ChosenElement>game boards</ChosenElement> and
        place it centrally on the table.
      </Typography>
      <RulesSection>
        <Stack direction="row" spacing={1} paddingTop={2} alignItems="center">
          <Typography variant="caption">Map: </Typography>
          <Chip
            label={MAPS.tharsis.name}
            color="primary"
            size="small"
            variant={rulesForMap === "tharsis" ? "filled" : "outlined"}
            onClick={
              rulesForMap === "tharsis"
                ? undefined
                : () => setRulesForMap("tharsis")
            }
          />
          <Chip
            label={MAPS.hellas.name}
            color="primary"
            size="small"
            variant={rulesForMap === "hellas" ? "filled" : "outlined"}
            onClick={
              rulesForMap === "hellas"
                ? undefined
                : () => setRulesForMap("hellas")
            }
          />
          <Chip
            label={MAPS.elysium.name}
            color="primary"
            size="small"
            variant={rulesForMap === "elysium" ? "filled" : "outlined"}
            onClick={
              rulesForMap === "elysium"
                ? undefined
                : () => setRulesForMap("elysium")
            }
          />
        </Stack>
        {rulesForMap === "tharsis" ? (
          <TharsisRules />
        ) : rulesForMap === "hellas" ? (
          <HellasRules />
        ) : (
          <ElysiumRules />
        )}
      </RulesSection>
    </>
  );
}

function TharsisRules(): JSX.Element {
  return (
    <>
      <Typography component="header" variant="h6">
        Milestones
      </Typography>
      <ul>
        <li>
          <strong>Terraformer</strong>: Having a terraform rating of at least
          35.
        </li>
        <li>
          <strong>Mayor</strong>: Owning at least 3 city tiles.
        </li>
        <li>
          <strong>Gardener</strong>: Owning at least 3 greenery tiles.
        </li>
        <li>
          <strong>Builder</strong>: Having at least 8 building tags in play.
        </li>
        <li>
          <strong>Planner</strong>: Having at least 16 cards in your hand when
          you claim this milestone.
        </li>
      </ul>
      <Typography component="header" variant="h6">
        Awards
      </Typography>
      <ul>
        <li>
          <strong>Landlord</strong>: Owning the most tiles in play.
        </li>
        <li>
          <strong>Banker</strong>: Having the highest M€ production.
        </li>
        <li>
          <strong>Scientist</strong>: Having the most science tags in play.
        </li>
        <li>
          <strong>Thermalist</strong>: Having the most heat resource cubes.
        </li>
        <li>
          <strong>Miner</strong>: Having the most steel and titanium resource
          cubes.
        </li>
      </ul>
    </>
  );
}

function HellasRules(): JSX.Element {
  return (
    <>
      <section>
        The map features two new placement bonuses:{" "}
        <ul>
          <li>Heat found in the Hellas sea.</li>
          <li>
            On the south pole itself, requiring you to pay 6 megacredits for
            placing a tile here, but giving you an ocean tile (along with its
            terraform rating) to place on any available ocean area.
          </li>
        </ul>
      </section>
      <section>
        The Hellas map lacks volcanos and the Noctis region, so the tiles from
        the cards <strong>Noctis City</strong> and <strong>Lava Flows</strong>{" "}
        lose their placement restrictions and may be placed on any non-ocean
        area.
      </section>
      <section>
        <Typography component="header" variant="h6">
          Milestones
        </Typography>
        <ul>
          <li>
            <strong>Diversifier</strong>: 8 different tags in play.
          </li>
          <li>
            <strong>Tactician</strong>: 5 cards with requirements in play.
          </li>
          <li>
            <strong>Polar Explorer</strong>: 3 tiles on the two bottom rows.
          </li>
          <li>
            <strong>Energizer</strong>: 6 energy production.
          </li>
          <li>
            <strong>Rim Settler</strong>: 3 jovian tags.
          </li>
        </ul>
      </section>
      <section>
        <Typography component="header" variant="h6">
          Awards
        </Typography>
        <ul>
          <li>
            <strong>Cultivator</strong>: most greenery tiles.
          </li>
          <li>
            <strong>Magnate</strong>: most automated cards in play (green
            cards).
          </li>
          <li>
            <strong>Space Baron</strong>: most space tags (event cards do not
            count).
          </li>
          <li>
            <strong>Excentric</strong>: most resources on cards.
          </li>
          <li>
            <strong>Contractor</strong>: most building tags (event cards do not
            count).
          </li>
        </ul>
      </section>
    </>
  );
}

function ElysiumRules(): JSX.Element {
  return (
    <>
      <section>
        The Elysium map does not have the Noctis region, so{" "}
        <strong>Noctis City</strong> may be placed without its restriction. It
        does, however, have four volcanic sites where the{" "}
        <strong>Lava Flows</strong> tile can be placed:{" "}
        <em>Arsia Mons, Olympus Mons, Elysium Mons, and Hecates Tholus</em>.
      </section>
      <section>
        <Typography component="header" variant="h6">
          Milestones
        </Typography>
        <ul>
          <li>
            <strong>Generalist</strong>: increased all 6 productions by at least
            1 step (starting production from corporation cards count as
            increase).
          </li>
          <li>
            <strong>Specialist</strong>: at least 10 in production of any
            resource.
          </li>
          <li>
            <strong>Ecologist</strong>: 4 bio tags (plant-, microbe- and animal
            tags count as bio tags).
          </li>
          <li>
            <strong>Tycoon</strong>: 15 project cards in play (blue and green
            cards).
          </li>
          <li>
            <strong>Legend</strong>: 5 played events (red cards).
          </li>
        </ul>
      </section>
      <section>
        <Typography component="header" variant="h6">
          Awards
        </Typography>
        <ul>
          <li>
            <strong>Celebrity</strong>: most cards in play (not events) with a
            cost of at least 20 megacredits.
          </li>
          <li>
            <strong>Industrialist</strong>: most steel and energy production.
          </li>
          <li>
            <strong>Desert Settler</strong>: most tiles south of the equator
            (the four bottom rows).
          </li>
          <li>
            <strong>Estate Dealer</strong>: most tiles adjacent to ocean tiles.
          </li>
          <li>
            <strong>Benefactor</strong>: highest terraform rating.{" "}
            <em>Count this award first!</em>.
          </li>
        </ul>
      </section>
    </>
  );
}

function availableForProducts(
  productIds: readonly TerraformingMarsProductId[]
): readonly MapId[] {
  return Vec.concat(
    ["tharsis"],
    productIds.includes("boards") ? ["hellas", "elysium"] : []
  );
}
