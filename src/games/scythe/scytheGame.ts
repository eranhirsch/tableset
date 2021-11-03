import { createGame } from "model/Game";
import boardStep from "./steps/boardStep";
import combatCardsDeckStep from "./steps/combatCardsDeckStep";
import encountersDeckStep from "./steps/encountersDeckStep";
import encounterTokensStep from "./steps/encounterTokensStep";
import factoryDeckStep from "./steps/factoryDeckStep";
import objectivesDeckStep from "./steps/objectivesDeckStep";
import productsMetaStep from "./steps/productsMetaStep";
import structureBonusStep from "./steps/structureBonusStep";
export const scytheGame = createGame({
  id: "scythe",
  name: "Scythe",

  products: {
    base: { isBase: true, name: "Scythe", bggId: 169786, year: 2016 },
    invaders: {
      name: "Invaders from Afar",
      bggId: 199727,
      year: 2016,
      isNotImplemented: true,
    },
    windGambit: {
      name: "The Wind Gambit",
      bggId: 223555,
      year: 2017,
      isNotImplemented: true,
    },
    fenris: {
      name: "The Rise of Fenris",
      bggId: 242277,
      year: 2018,
      isNotImplemented: true,
    },
    encounters: {
      name: "Encounters",
      bggId: 262151,
      year: 2018,
      isNotImplemented: true,
    },
    modularBoard: {
      name: "Modular Board",
      bggId: 279304,
      year: 2019,
      isNotImplemented: true,
    },
    promo1: {
      name: "Promo Pack #1 - Encounter Cards 29-32",
      bggId: 211731,
      year: 2016,
      isNotImplemented: true,
    },
    promo2: {
      name: "Promo Pack #2 - Encounter Cards 33-36",
      bggId: 205121,
      year: 2016,
      isNotImplemented: true,
    },
    promo3: {
      name: "Promo Pack #3 - Objective Cards 24-27",
      bggId: 211732,
      year: 2016,
      isNotImplemented: true,
    },
    promo4: {
      name: "Promo Pack #4 - Factory Cards 13-18",
      bggId: 211733,
      year: 2016,
      isNotImplemented: true,
    },
    promo6: {
      name: "Promo Pack #6 - Encounter Card 37",
      bggId: 212879,
      year: 2016,
      isNotImplemented: true,
    },
    promo7: {
      name: "Promo Pack #7 - Encounter Card 38",
      bggId: 204984,
      year: 2016,
      isNotImplemented: true,
    },
    promo11: {
      name: "Promo Pack #11 - Encounter Card 39",
      bggId: 221033,
      year: 2017,
      isNotImplemented: true,
    },
    promo12: {
      name: "Promo Pack #12 - Encounter Card 40",
      bggId: 232176,
      year: 2017,
      isNotImplemented: true,
    },
    promo13: {
      name: "Promo Pack #13 - Encounter Card 41",
      bggId: 232087,
      year: 2017,
      isNotImplemented: true,
    },
    promo14: {
      name: "Promo Pack #14 - Encounter Card 42",
      bggId: 237663,
      year: 2017,
      isNotImplemented: true,
    },
    bonusPromos: {
      name: "Bonus Promo Pack - Encounter Cards 37-42",
      bggId: 276229,
      year: 2018,
      isNotImplemented: true,
    },
  },

  productsMetaStep,

  steps: [
    boardStep,
    encounterTokensStep,
    encountersDeckStep,
    objectivesDeckStep,
    combatCardsDeckStep,
    factoryDeckStep,
    structureBonusStep,
  ],
});
