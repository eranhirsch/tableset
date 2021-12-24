import { Typography } from "@mui/material";
import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { createPlayerColorsStep, createPlayOrderStep } from "games/global";
import corporateEraVariant from "./steps/corporateEraVariant";
import corporationsStep from "./steps/corporationsStep";
import draftRulesStep from "./steps/draftRulesStep";
import draftVariant from "./steps/draftVariant";
import firstPlayerMarker from "./steps/firstPlayerMarker";
import firstPlayerStep from "./steps/firstPlayerStep";
import mapStep from "./steps/mapStep";
import playerBoardsStep from "./steps/playerBoardsStep";
import productsMetaStep from "./steps/productsMetaStep";
import projectDeckStep from "./steps/projectDeckStep";
import startingConditionsStep from "./steps/startingConditionsStep";

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
      isNotImplemented: true,
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
        <Typography variant="body1" textAlign="justify">
          {/* Copied from the manual verbatim */}
          Place the <ChosenElement>temperature</ChosenElement> and{" "}
          <ChosenElement extraInfo="markers">oxygen</ChosenElement> on their
          starting positions. Also place the{" "}
          <ChosenElement extraInfo="marker">generation</ChosenElement> on{" "}
          <strong>1</strong> on the <em>TR track</em>.
        </Typography>
      ),
    }),

    createGameStep({
      id: "resourceCubes",
      InstanceManualComponent: () => (
        <Typography variant="body1" textAlign="justify">
          Create a pile for the{" "}
          <ChosenElement extraInfo="cubes">resource</ChosenElement> so that
          everyone can reach them.
        </Typography>
      ),
    }),
    createGameStep({
      id: "mapTiles",
      InstanceManualComponent: () => (
        <Typography variant="body1" textAlign="justify">
          Create a pile for the <strong>60</strong>{" "}
          <ChosenElement extraInfo="tiles">Greenery/City</ChosenElement>, and a
          pile for the <strong>11</strong>{" "}
          <ChosenElement extraInfo="tiles">Special</ChosenElement> so that
          everyone can reach them.
        </Typography>
      ),
    }),

    projectDeckStep,

    createPlayOrderStep(), // Templatable
    firstPlayerStep, // Templatable
    firstPlayerMarker,

    createPlayerColorsStep({
      productsMetaStep,
      availableColors: () => ["red", "green", "yellow", "black", "blue"],
    }),
    playerBoardsStep,

    corporationsStep,
    createGameStep({
      id: "startingProjects",
      InstanceManualComponent: () => (
        <>
          <Typography variant="body1" textAlign="justify">
            Deal each player <strong>10</strong>{" "}
            <ChosenElement extraInfo="cards">Project</ChosenElement>.
          </Typography>
          <Typography variant="body2" textAlign="justify">
            <em>Players should keep these cards hidden</em>.
          </Typography>
        </>
      ),
    }),
    createGameStep({
      id: "researchPhase",
      InstanceManualComponent: () => (
        <>
          <Typography variant="body1" textAlign="justify">
            Players now simultaneously choose which corporation to play, and
            what project cards to keep in their starting hand.
          </Typography>
          <Typography variant="body2" textAlign="justify">
            <em>
              players shouldn't reveal their selections yet, that is done in the
              next step.
            </em>
          </Typography>
        </>
      ),
    }),
    startingConditionsStep,

    draftRulesStep,

    createGameStep({
      id: "startTheGame",
      InstanceManualComponent: () => (
        <Typography variant="body1" textAlign="justify">
          The first generation starts without a <em>player order</em> phase and
          without a <em>research</em> phase{" "}
          <em>(since you just performed those phases during setup)</em>, so the
          first player just starts the action phase.
        </Typography>
      ),
    }),
  ],
});

