import { Typography } from "@mui/material";
import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { createPlayerColorsStep, createPlayOrderStep } from "games/global";
import corporateEraVariant from "./steps/corporateEraVariant";
import firstPlayerMarker from "./steps/firstPlayerMarker";
import firstPlayerStep from "./steps/firstPlayerStep";
import mapStep from "./steps/mapStep";
import playerBoardsStep from "./steps/playerBoardsStep";
import productsMetaStep from "./steps/productsMetaStep";
import projectDeckStep from "./steps/projectDeckStep";

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

    mapStep,
    createGameStep({
      id: "oceans",
      InstanceManualComponent: () => (
        <Typography variant="body1">
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
        <Typography variant="body1">
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
        <Typography variant="body1">
          Create a pile for the{" "}
          <ChosenElement extraInfo="cubes">resource</ChosenElement> so that
          everyone can reach them.
        </Typography>
      ),
    }),
    createGameStep({
      id: "mapTiles",
      InstanceManualComponent: () => (
        <Typography variant="body1">
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
      availableColors: () => ["red", "green", "yellow", "black", "blue"],
    }),
    playerBoardsStep,
  ],
});
