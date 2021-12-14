import { createGame } from "model/Game";
import productsMetaStep from "./steps/productsMetaStep";

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
  steps: [],
});
