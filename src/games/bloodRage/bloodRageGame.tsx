import { Typography } from "@mui/material";
import { createGameStep } from "games/core/steps/createGameStep";
import { ChosenElement } from "games/core/ux/ChosenElement";
import { firstPlayerStep } from "games/global";
import { createGame } from "model/Game";
import { clanStep, playerClanStep } from "./steps/clanStep";
import destroyedStep from "./steps/destroyedStep";
import pillageTokensStep from "./steps/pillageTokensStep";
import playOrderStep from "./steps/playOrderStep";
import productsMetaStep from "./steps/productsMetaStep";
import ragnarokStep from "./steps/ragnarokStep";

export default createGame({
  id: "bloodRage",
  name: "Blood Rage",
  productsMetaStep,
  products: {
    base: { name: "Blood Rage", bggId: 170216, year: 2015, isBase: true },
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

    // TODO: Prepare your clan

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
