import { Typography } from "@mui/material";
import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { HeaderAndSteps } from "games/core/ux/HeaderAndSteps";
import { createPlayerColorsStep, createPlayOrderStep } from "games/global";
import corporateEraVariant from "./steps/corporateEraVariant";
import corporationsStep from "./steps/corporationsStep";
import draftRulesStep from "./steps/draftRulesStep";
import draftVariant from "./steps/draftVariant";
import firstPlayerStep from "./steps/firstPlayerStep";
import initialProjectsStep from "./steps/initialProjectsStep";
import mapStep from "./steps/mapStep";
import mapTilesStep from "./steps/mapTilesStep";
import playerBoardsStep from "./steps/playerBoardsStep";
import productsMetaStep from "./steps/productsMetaStep";
import projectDeckStep from "./steps/projectDeckStep";
import researchPhaseStep from "./steps/researchPhaseStep";
import resourceCubesStep from "./steps/resourceCubesStep";
import soloCitiesStep from "./steps/soloCitiesStep";
import soloRulesStep from "./steps/soloRulesStep";
import startingConditionsStep from "./steps/startingConditionsStep";
import startTheGameStep from "./steps/startTheGameStep";

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
      isNotImplemented: true,
    },
    boards: {
      name: "Hellas & Elysium",
      bggId: 218127,
      year: 2017,
      isNotImplemented: true,
    },
    prelude: {
      name: "Prelude",
      bggId: 247030,
      year: 2018,
      isNotImplemented: true,
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

    mapStep,
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
    createGameStep({
      id: "markers",
      InstanceManualComponent: () => (
        <HeaderAndSteps
          synopsis={
            <>
              Place the white{" "}
              <ChosenElement extraInfo="cubes">marker</ChosenElement> (plastic)
              on their starting locations:
            </>
          }
        >
          <>
            The <ChosenElement extraInfo="marker">temperature</ChosenElement> on{" "}
            <strong>-30{"\u00b0"}C</strong>.
          </>
          <>
            The <ChosenElement extraInfo="marker">oxygen</ChosenElement> on{" "}
            <strong>0%</strong>.
          </>
          <>
            The <ChosenElement extraInfo="marker">generation</ChosenElement> on{" "}
            <strong>1</strong> on the <em>TR track</em>.
          </>
        </HeaderAndSteps>
      ),
    }),

    resourceCubesStep,
    mapTilesStep,

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
    initialProjectsStep,
    researchPhaseStep,
    startingConditionsStep,

    draftRulesStep,
    soloRulesStep,

    startTheGameStep,
  ],
});

