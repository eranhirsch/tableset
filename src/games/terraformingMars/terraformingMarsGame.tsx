import { Typography } from "@mui/material";
import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { createPlayerColorsStep, createPlayOrderStep } from "games/global";
import additionalBoardsStep from "./steps/additionalBoardsStep";
import coloniesCorpsVariant from "./steps/coloniesCorpsVariant";
import coloniesRules from "./steps/coloniesRules";
import coloniesStep from "./steps/coloniesStep";
import coloniesVariant from "./steps/coloniesVariant";
import corporateEraVariant from "./steps/corporateEraVariant";
import corporationsStep from "./steps/corporationsStep";
import draftRules from "./steps/draftRules";
import draftVariant from "./steps/draftVariant";
import firstPlayerStep from "./steps/firstPlayerStep";
import initialPreludesStep from "./steps/initialPreludesStep";
import initialProjectsStep from "./steps/initialProjectsStep";
import mapStep from "./steps/mapStep";
import mapTilesStep from "./steps/mapTilesStep";
import markersStep from "./steps/markersStep";
import milestonesAndAwardsStep from "./steps/milestonesAndAwardsStep";
import playerComponentsStep from "./steps/playerComponentsStep";
import playPreludesStep from "./steps/playPreludesStep";
import preludeCorpsVariant from "./steps/preludeCorpsVariant";
import preludeVariant from "./steps/preludeVariant";
import productsMetaStep from "./steps/productsMetaStep";
import projectDeckStep from "./steps/projectDeckStep";
import researchPhaseStep from "./steps/researchPhaseStep";
import resourceCubesStep from "./steps/resourceCubesStep";
import solarPhaseRules from "./steps/solarPhaseRules";
import soloCitiesStep from "./steps/soloCitiesStep";
import soloRules from "./steps/soloRules";
import startingConditionsStep from "./steps/startingConditionsStep";
import startTheGameStep from "./steps/startTheGameStep";
import trSoloVariant from "./steps/trSoloVariant";
import turmoilStep from "./steps/turmoilStep";
import turmoilVariant from "./steps/turmoilVariant";
import venusCorpsVariant from "./steps/venusCorpsVariant";
import venusVariant from "./steps/venusVariant";
import worldGovernmentVariant from "./steps/worldGovernmentVariant";

export default createGame({
  id: "terraformingMars",
  name: "Terraforming Mars",
  productsMetaStep,
  products: {
    base: {
      name: "Terraforming Mars",
      bggId: 167791,
      year: 2016,
      isBase: true,
    },
    venus: {
      name: "Venus Next",
      bggId: 231965,
      year: 2017,
    },
    boards: {
      name: "Hellas & Elysium",
      bggId: 218127,
      year: 2017,
    },
    prelude: {
      name: "Prelude",
      bggId: 247030,
      year: 2018,
    },
    colonies: {
      name: "Colonies",
      bggId: 255681,
      year: 2018,
    },
    turmoil: {
      name: "Turmoil",
      bggId: 273473,
      year: 2019,
    },
  },

  steps: [
    corporateEraVariant, // Variant
    draftVariant, // Variant
    venusVariant, // Variant
    venusCorpsVariant, // Variant
    worldGovernmentVariant, // Variant
    preludeVariant, // Variant
    preludeCorpsVariant, // Variant
    trSoloVariant, // Variant
    coloniesVariant, // Variant
    coloniesCorpsVariant, // Variant
    turmoilVariant, // Variant

    // "Step 1" (base game manual)
    mapStep,
    additionalBoardsStep,
    coloniesStep,
    turmoilStep,
    createGameStep({
      id: "oceans",
      InstanceManualComponent: () => (
        <Typography variant="body1" textAlign="justify">
          {/* Copied from the manual verbatim */}
          Place the <strong>9</strong>{" "}
          <ChosenElement extraInfo="tiles">ocean</ChosenElement> on their{" "}
          <em>reserved space</em>.
        </Typography>
      ),
    }),
    markersStep,
    milestonesAndAwardsStep,

    // "Step 2" (base game manual)
    resourceCubesStep,
    mapTilesStep, // Templatable

    // "Step 3" (base game manual)
    projectDeckStep,

    soloCitiesStep,

    // "Step 4" (base game manual)
    createPlayOrderStep(), // Templatable
    firstPlayerStep, // Templatable
    createPlayerColorsStep({
      productsMetaStep,
      availableColors: () => ["black", "blue", "green", "red", "yellow"],
    }),
    playerComponentsStep,

    // "Step 5" (base game manual)
    corporationsStep,
    initialPreludesStep,
    initialProjectsStep,

    // "Step 6" (base game manual)
    researchPhaseStep,

    // "Step 7" (base game manual)
    startingConditionsStep,
    playPreludesStep,

    draftRules,
    soloRules,
    solarPhaseRules,
    coloniesRules,

    // "Step 8" (base game manual)
    startTheGameStep,
  ],
});

