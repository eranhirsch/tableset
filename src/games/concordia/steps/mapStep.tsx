import { Typography } from "@material-ui/core";
import { Strategy } from "../../../core/Strategy";
import templateSlice from "../../../features/template/templateSlice";
import { createGameStep } from "../../createGameStep";
import GenericItemsFixedTemplateLabel from "../../ux/GenericItemsFixedTemplateLabel";
import GenericItemsListPanel from "../../ux/GenericItemsListPanel";

export type Zone = "A" | "B" | "C" | "D";

export type MapId = "italia" | "imperium";

// We can't use `Map` as that's already a thing in js
type MapBoard = Readonly<{
  name: string;
  provinces: Readonly<
    Partial<
      Record<Zone, Readonly<{ [provinceName: string]: readonly string[] }>>
    >
  >;
}>;

export const MAPS: Record<MapId, MapBoard> = {
  italia: {
    name: "Italia",
    provinces: {
      A: {
        Venetia: ["Bavsanvm", "Aqvileia", "Verona"],
        Transpadana: ["Comvm", "Segvsio"],
        Liguria: ["Nicaea", "Genva"],
      },
      B: {
        Aemilia: ["Mvtina", "Ravenna"],
        Etruria: ["Florentia", "Cosa"],
        Corsica: ["Aleria", "Olbia"],
        Campania: ["Casinvm", "Neapolis"],
      },
      C: {
        Umbria: ["Ancona", "Spoletvm", "Hadria"],
        Apulia: ["Lvcria", "Brvndisivm"],
        Lucania: ["Potentia", "Croton"],
        Sicilia: ["Messana", "Syracvsae", "Panormvs"],
      },
    },
  },

  imperium: {
    name: "Imperium",
    provinces: {
      A: {
        Britannia: ["Isca D.", "Londonivm"],
        Germania: ["Colonia A.", "Vindobona"],
        Dacia: ["Sirmivm", "Napoca", "Tomis"],
      },
      B: {
        Galia: ["Lvtetia", "Bvrdigala", "Massilia"],
        Hispania: ["Brigantivm", "Olisipo", "Valentia"],
        Mauretania: ["Rvsadir", "Carthago"],
      },
      C: {
        Lybia: ["Leptis Magna", "Cyrene"],
        Asia: ["Bycantivm", "Sinope", "Attalia"],
        Syria: ["Antiochia", "Tyros"],
        Aegyptus: ["Alexandria", "Memphis", "Petra"],
      },
      D: {
        Italia: ["Novaria", "Aqvileia", "Syracvsae"],
        Hellas: ["Dirrhachivm", "Athenae"],
      },
    },
  },
};

const ALL_ITEM_IDS: readonly MapId[] = Object.keys(MAPS) as MapId[];

const ID = "map";

export default createGameStep({
  id: ID,
  derivers: {
    renderInstanceItem: (itemId) => (
      <Typography variant="h4" sx={{ fontVariantCaps: "petite-caps" }}>
        {labelForItem(itemId)}
      </Typography>
    ),

    random: () => ALL_ITEM_IDS[Math.floor(Math.random() * ALL_ITEM_IDS.length)],

    recommended: ({ playerIds }) =>
      playerIds.length <= 1
        ? undefined
        : playerIds.length <= 3
        ? "italia"
        : playerIds.length <= 5
        ? "imperium"
        : undefined,

    fixed: {
      initializer: () => ({
        id: ID,
        strategy: Strategy.FIXED,
        value: ALL_ITEM_IDS[0],
      }),

      renderTemplateLabel: (current) => (
        <GenericItemsFixedTemplateLabel
          onLabelForItem={labelForItem}
          selectedId={current}
        />
      ),
      renderSelector: (current) => (
        <GenericItemsListPanel
          itemIds={ALL_ITEM_IDS}
          selectedId={current}
          onLabelForItem={labelForItem}
          onUpdateItem={(itemId) =>
            templateSlice.actions.constantValueChanged({
              id: ID,
              value: itemId,
            })
          }
        />
      ),
    },
  },
});

function labelForItem(id: MapId): string {
  return MAPS[id].name;
}
