import { Typography } from "@mui/material";
import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { createPlayerColorsStep, createPlayOrderStep } from "games/global";
import additionalBoardsStep from "./steps/additionalBoardsStep";
import coloniesCorpsVariant from "./steps/coloniesCorpsVariant";
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
import playerBoardsStep from "./steps/playerBoardsStep";
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
import venusCorpsVariant from "./steps/venusCorpsVariant";
import venusMilestoneAndAwardStep from "./steps/venusMilestoneAndAwardStep";
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
      isNotImplemented: true,
    },
    turmoil: {
      name: "Turmoil",
      bggId: 273473,
      year: 2019,
      isNotImplemented: true,
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

    mapStep,
    additionalBoardsStep,
    coloniesStep,
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
    venusMilestoneAndAwardStep,

    resourceCubesStep,
    mapTilesStep, // Templatable

    projectDeckStep,

    createPlayOrderStep(), // Templatable
    firstPlayerStep, // Templatable

    createPlayerColorsStep({
      productsMetaStep,
      availableColors: () => ["black", "blue", "green", "red", "yellow"],
    }),
    playerBoardsStep,

    soloCitiesStep,

    corporationsStep,
    initialPreludesStep,
    initialProjectsStep,
    researchPhaseStep,
    startingConditionsStep,
    playPreludesStep,

    draftRules,
    soloRules,
    solarPhaseRules,

    startTheGameStep,
  ],
});

