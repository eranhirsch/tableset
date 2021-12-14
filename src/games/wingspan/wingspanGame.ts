import { createGame } from "model/Game";
import productsMetaStep from "./steps/productsMetaStep";

export default createGame({
  id: "wingspan",
  name: "Wingspan",
  productsMetaStep,
  products: {
    base: { name: "Wingspan", bggId: 266192, isBase: true, year: 2019 },
    swiftStart: { name: "Swift-Start Promo Pack", bggId: 290837, year: 2019 },
    europe: { name: "European Expansion", bggId: 290448, year: 2019 },
    oceania: { name: "Oceania Expansion", bggId: 300580, year: 2020 },
  },
  steps: [],
});
