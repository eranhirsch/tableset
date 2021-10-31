import { createGameStep } from "games/core/steps/createGameStep";
import { firstPlayerStep } from "games/global";
import { createGame } from "model/Game";
import aegyptusStep from "./steps/aegyptusStep";
import bonusTilesStep from "./steps/bonusTilesStep";
import cityTilesStep from "./steps/cityTilesStep";
import cretaStep from "./steps/cretaStep";
import fishMarketBoardStep from "./steps/fishMarketBoardStep";
import fishMarketVariant from "./steps/fishMarketVariant";
import forumDecksStep from "./steps/forumDecksStep";
import forumDisplayStep from "./steps/forumDisplayStep";
import forumExpertAuctionVariant from "./steps/forumExpertAuctionVariant";
import forumInitialTileStep from "./steps/forumInitialTileStep";
import forumMarketStep from "./steps/forumMarketStep";
import forumVariantStep from "./steps/forumVariant";
import germaniaRomanCastlesStep from "./steps/germaniaRomanCastlesStep";
import mapStep from "./steps/mapStep";
import marketBoardStep from "./steps/marketBoardStep";
import marketCardsStep from "./steps/marketCardsStep";
import marketDeckStep from "./steps/marketDeckStep";
import marketDisplayStep from "./steps/marketDisplayStep";
import noStartingResourcesVariant from "./steps/noStartingResourcesVariant";
import playerCardsStep from "./steps/playerCardsStep";
import playerColorsStep from "./steps/playerColorsStep";
import playerComponentsStep from "./steps/playerComponentsStep";
import playOrderStep from "./steps/playOrderStep";
import praefectusMagnusStep from "./steps/praefectusMagnusStep";
import productsMetaStep from "./steps/productsMetaStep";
import resourcePilesStep from "./steps/resourcePilesStep";
import saltVariantStep from "./steps/saltVariant";
import startingColonistsStep from "./steps/startingColonistsStep";
import startingMoneyStep from "./steps/startingMoneyStep";
import startingResourcesStep from "./steps/startingResourcesStep";
import teamPlayVariant from "./steps/teamPlayVariant";
import teamSelectionStep from "./steps/teamSelectionStep";
import turnOrderMarkerStep from "./steps/turnOrderMarkerStep";
import venusScoringVariant from "./steps/venusScoringVariant";
import wineMarketVariant from "./steps/wineMarketVariant";

export const concordiaGame = createGame({
  products: {
    base: { isBase: true, name: "Concordia", bggId: 124361, year: 2013 },
    britanniaGermania: {
      name: "Britannia / Germania",
      bggId: 165023,
      year: 2014,
    },
    salsa: { name: "Salsa", bggId: 181084, year: 2015 },
    galliaCorsica: { name: "Gallia / Corsica", bggId: 208364, year: 2016 },
    forumMini: {
      name: "8 Forum Cards mini-expansion",
      bggId: 209574,
      year: 2016,
      isNotImplemented: true,
    },
    aegyptusCreta: { name: "Aegyptus / Creta", bggId: 232917, year: 2017 },
    venus: { name: "Venus (Expansion)", bggId: 262711, year: 2018 },
    venusBase: {
      isBase: true,
      name: "Concordia Venus",
      bggId: 256916,
      year: 2018,
    },
    balearicaCyprus: { name: "Balearica / Cyprus", bggId: 283177, year: 2019 },
    balearicaItalia: { name: "Balearica / Italia", bggId: 283362, year: 2019 },
    solitaria: {
      name: "Solitaria",
      bggId: 325490,
      year: 2021,
      isNotImplemented: true,
    },
  },

  productsMetaStep,

  steps: [
    // Variants ---
    teamPlayVariant, // Templatable
    venusScoringVariant, // Templatable
    saltVariantStep, // Templatable
    wineMarketVariant, // Templatable
    forumVariantStep, // Templatable
    forumExpertAuctionVariant, // Templatable
    fishMarketVariant, // Templatable
    noStartingResourcesVariant, // Templatable

    // Global State ----

    // Map
    mapStep, // Templatable
    cityTilesStep, // Templatable
    bonusTilesStep,
    aegyptusStep,
    cretaStep,
    germaniaRomanCastlesStep, // Templatable

    // Market
    marketBoardStep,
    marketCardsStep,
    marketDisplayStep, // Templatable
    marketDeckStep,
    createGameStep({
      id: "concordiaCard",
      InstanceManualComponent: "Place the Concordia card next to the board.",
    }),

    // Fish
    fishMarketBoardStep, // Templatable

    // Pools/Piles
    resourcePilesStep,
    createGameStep({
      id: "bank",
      InstanceManualComponent:
        "Form a pile of coins as the bank near the board.",
    }),

    // Player Specific ------
    teamSelectionStep, // Templatable

    playOrderStep, // Templatable
    firstPlayerStep, // Templatable

    // Base game
    playerColorsStep, // Templatable
    playerComponentsStep,
    playerCardsStep,
    startingColonistsStep,
    startingResourcesStep,
    startingMoneyStep,
    praefectusMagnusStep,

    // Expansions
    turnOrderMarkerStep,
    forumDisplayStep,
    forumDecksStep,
    forumInitialTileStep,
    forumMarketStep,
  ],
});
