import { createGameStep } from "games/core/steps/createGameStep";
import { createGame } from "model/Game";
import advancedAirshipVariant from "./steps/advancedAirshipVariant";
import airshipAggressiveStep, {
  airshipAggressiveAssignmentStep
} from "./steps/airshipAggressiveStep";
import airshipPassiveStep, {
  airshipPassiveAssignmentStep
} from "./steps/airshipPassiveStep";
import airshipPlacementStep from "./steps/airshipPlacementStep";
import airshipVariant from "./steps/airshipVariant";
import alliancesStep from "./steps/alliancesStep";
import alliancesVariant from "./steps/alliancesVariant";
import baselessFactionsStep from "./steps/baselessFactionsStep";
import boardStep from "./steps/boardStep";
import combatCardsDeckStep from "./steps/combatCardsDeckStep";
import encountersDeckStep from "./steps/encountersDeckStep";
import encounterTokensStep from "./steps/encounterTokensStep";
import factionCombatCardsStep from "./steps/factionCombatCardsStep";
import factionMatComponentsStep from "./steps/factionMatComponentsStep";
import factionsStep from "./steps/factionsStep";
import factionStartingPowerStep from "./steps/factionStartingPowerStep";
import factoryDeckStep from "./steps/factoryDeckStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import infraModsStep from "./steps/infraModsStep";
import infraModsVariant from "./steps/infraModsVariant";
import madTeslaStep from "./steps/madTeslaStep";
import madTeslaVariant from "./steps/madTeslaVariant";
import mechModsStep from "./steps/mechModsStep";
import mechModsVariant from "./steps/mechModsVariant";
import missionPossibleStep from "./steps/missionPossibleStep";
import modularBoardVariant from "./steps/modularBoardVariant";
import modularFactionDrafting from "./steps/modularFactionDrafting";
import modularHomeBasesStep from "./steps/modularHomeBasesStep";
import modularTilesStep from "./steps/modularTilesStep";
import objectivesDeckStep from "./steps/objectivesDeckStep";
import playerAssignmentsStep from "./steps/playerAssignmentsStep";
import playerMatComponentsStep from "./steps/playerMatComponentsStep";
import playerMatsStep from "./steps/playerMatsStep";
import playerMatStartingMoneyStep from "./steps/playerMatStartingMoneyStep";
import playerMatStartingPopularityStep from "./steps/playerMatStartingPopularityStep";
import playerObjectivesStep from "./steps/playerObjectivesStep";
import productsMetaStep from "./steps/productsMetaStep";
import removeModularTilesStep from "./steps/removeModularTilesStep";
import resolutionTileStep from "./steps/resolutionTileStep";
import resolutionVariant from "./steps/resolutionVariant";
import resourcesPilesStep from "./steps/resourcesPilesStep";
import rivalsStep from "./steps/rivalsStep";
import rivalsVariant from "./steps/rivalsVariant";
import seatingStep from "./steps/seatingStep";
import startingWorkersStep from "./steps/startingWorkersStep";
import structureBonusStep from "./steps/structureBonusStep";
import teslaStep from "./steps/teslaStep";
import teslaVariant from "./steps/teslaVariant";
import triumphTilesStep from "./steps/triumphTilesStep";
import triumphTilesVariant from "./steps/triumphTilesVariant";
import vesnaFactoryCardsStep from "./steps/vesnaFactoryCardsStep";
import vesnaMechAbilitiesStep from "./steps/vesnaMechAbilitiesStep";
import warAndPeaceVariant from "./steps/warAndPeaceVariant";
import warOrPeaceStep from "./steps/warOrPeaceStep";

export const scytheGame = createGame({
  id: "scythe",
  name: "Scythe",

  products: {
    base: { isBase: true, name: "Scythe", bggId: 169786, year: 2016 },
    invaders: {
      name: "Invaders from Afar",
      bggId: 199727,
      year: 2016,
    },
    windGambit: {
      name: "The Wind Gambit",
      bggId: 223555,
      year: 2017,
    },
    fenris: {
      name: "The Rise of Fenris",
      bggId: 242277,
      year: 2018,
      isNotImplemented: true,
    },
    modularBoard: {
      name: "Modular Board",
      bggId: 279304,
      year: 2019,
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
    },
    promo4: {
      name: "Promo Pack #4 - Factory Cards 13-18",
      bggId: 211733,
      year: 2016,
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
    encounters: {
      name: "Encounters",
      bggId: 262151,
      year: 2018,
      isNotImplemented: true,
    },
  },

  productsMetaStep,

  steps: [
    airshipVariant, // Variant
    advancedAirshipVariant, // Variant
    resolutionVariant, // Variant
    mechModsVariant, // Variant
    infraModsVariant, // Variant
    warAndPeaceVariant, // Variant
    triumphTilesVariant, // Variant
    rivalsVariant, // Variant
    alliancesVariant, // Variant
    teslaVariant, // Variant
    madTeslaVariant, // Variant
    modularBoardVariant, // Variant

    boardStep, // Templatable
    modularTilesStep, // Templatable
    modularHomeBasesStep, // Templatable

    warOrPeaceStep, // Templatable
    triumphTilesStep, // Templatable

    structureBonusStep, // Templatable

    factionsStep, // Templatable
    baselessFactionsStep, // Templatable
    playerMatsStep, // Templatable
    playerAssignmentsStep, // Templatable

    modularFactionDrafting,

    removeModularTilesStep,

    resolutionTileStep, // Templatable
    missionPossibleStep, // Templatable

    encounterTokensStep,

    airshipAggressiveStep, // Templatable
    airshipAggressiveAssignmentStep, // Templatable
    airshipPassiveStep, // Templatable
    airshipPassiveAssignmentStep, // Templatable

    seatingStep,

    resourcesPilesStep,
    createGameStep({
      id: "bank",
      InstanceManualComponent:
        "Form a pile of coins as the bank near the board.",
    }),

    playerMatComponentsStep,
    mechModsStep, // Templatable
    infraModsStep, // Templatable
    vesnaFactoryCardsStep, // Templatable
    vesnaMechAbilitiesStep, // Templatable
    factionMatComponentsStep,
    alliancesStep,

    createGameStep({
      id: "character",
      InstanceManualComponent:
        "Each player puts their character miniature on their faction's home base.",
    }),
    airshipPlacementStep,
    startingWorkersStep,

    encountersDeckStep,
    objectivesDeckStep,
    combatCardsDeckStep,
    factoryDeckStep,

    playerMatStartingPopularityStep,
    factionStartingPowerStep,
    factionCombatCardsStep,
    playerMatStartingMoneyStep,
    playerObjectivesStep,

    rivalsStep,

    teslaStep,
    madTeslaStep,

    createGameStep({
      id: "playerAids",
      InstanceManualComponent:
        "Hand each player a riverwalk card, and for new players a quick-start card too.",
    }),

    firstPlayerStep,
  ],
});
