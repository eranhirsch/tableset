import { createGame } from "games/core/Game";
import productsMetaStep from "./steps/productsMetaStep";

export default createGame({
  id: "wingspan",
  name: "Wingspan",
  productsMetaStep,
  products: {
    base: {
      name: "Wingspan",
      bggId: 266192,
      isBase: true,
      year: 2019,
      isNotImplemented: true,
    },
    swiftStart: {
      name: "Swift-Start Promo Pack",
      bggId: 290837,
      year: 2019,
      isNotImplemented: true,
    },
    europe: {
      name: "European Expansion",
      bggId: 290448,
      year: 2019,
      isNotImplemented: true,
    },
    oceania: {
      name: "Oceania Expansion",
      bggId: 300580,
      year: 2020,
      isNotImplemented: true,
    },
  },
  steps: [],
});
