import { Typography } from "@mui/material";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { firstPlayerStep } from "games/global";
import { createGame } from "model/Game";
import { clanStep, playerClanStep } from "./steps/clanStep";
import clanTokensStep from "./steps/clanTokensStep";
import destroyedStep from "./steps/destroyedStep";
import pillageTokensStep from "./steps/pillageTokensStep";
import playOrderStep from "./steps/playOrderStep";
import productsMetaStep from "./steps/productsMetaStep";
import ragnarokStep from "./steps/ragnarokStep";
import reserveStep from "./steps/reserveStep";

export default createGame({
  id: "bloodRage",
  name: "Blood Rage",
  productsMetaStep,
  products: {
    base: { name: "Blood Rage", bggId: 170216, year: 2015, isBase: true },
    // Expansions
    mystics: {
      name: "Mystics of Midgard",
      bggId: 175100,
      year: 2015,
      isNotImplemented: true,
    },
    gods: {
      name: "Gods of Asgard",
      bggId: 174801,
      year: 2015,
      isNotImplemented: true,
    },
    player5: {
      name: "5th Player",
      bggId: 174506,
      year: 2015,
      isNotImplemented: true,
    },
    // Promos
    troll: {
      name: "Mystic Troll",
      bggId: 310026,
      year: 2015,
      isNotImplemented: true,
    },
    giant: {
      name: "Mountain Giant",
      bggId: 350961,
      year: 2015,
      isNotImplemented: true,
    },
    ksExclusives: {
      name: "Kickstarter Exclusives",
      bggId: 174388,
      year: 2015,
      isNotImplemented: true,
    },
    fenrir: {
      name: "Fenrir",
      bggId: 311901,
      year: 2015,
      isNotImplemented: true,
    },
    hili: {
      name: "Hili - The Even-Handed",
      bggId: 193898,
      year: 2016,
      isNotImplemented: true,
    },
    promos: {
      name: "Promos Box",
      bggId: 286883,
      year: 2019,
      isNotImplemented: true,
    },
  },
  steps: [
    createGameStep({
      id: "board",
      InstanceManualComponent: () => (
        <Typography variant="body1">
          Place the <ChosenElement>Game Board</ChosenElement> in the middle of
          the table.
        </Typography>
      ),
    }),
    createGameStep({
      id: "sheets",
      InstanceManualComponent: () => (
        <Typography variant="body1">
          Next to the Game Board, place the{" "}
          <ChosenElement>Valhalla</ChosenElement> sheet and the{" "}
          <ChosenElement>Age Track</ChosenElement> sheet.
        </Typography>
      ),
    }),

    pillageTokensStep, // Templatable
    ragnarokStep, // Templatable
    destroyedStep, // Templatable

    playOrderStep, // Templatable
    clanStep, // Templatable
    playerClanStep, // Templatable

    reserveStep,

    createGameStep({
      id: "glory",
      InstanceManualComponent: () => (
        <Typography variant="body1">
          Each player takes their clan’s{" "}
          <ChosenElement>Glory Marker</ChosenElement> and place it on the Glory
          Track around the board, on the <strong>0</strong> spot.
        </Typography>
      ),
    }),

    clanTokensStep,

    // TODO: Prepare Cards

    createGameStep({
      id: "monsters",
      InstanceManualComponent: () => (
        <Typography variant="body1">
          Place all <ChosenElement>Monster figures</ChosenElement> next to the
          board, within reach of all players.
        </Typography>
      ),
    }),
    createGameStep({
      id: "sagaToken",
      InstanceManualComponent: () => (
        <Typography variant="body1">
          Place the <ChosenElement>Saga token</ChosenElement> on the first spot
          of the First Age on the Story Track. This is the “Gods’ Gifts – Age 1”
          spot. The Saga token will be moved from phase to phase of each Age,
          one Age after the other, in order to help players keep track as the
          game progresses.
        </Typography>
      ),
    }),

    firstPlayerStep, // Templatable

    // TODO: First Player Token
  ],
});
