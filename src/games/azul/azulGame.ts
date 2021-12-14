import { createGame } from "model/Game";
import productsMetaStep from "./steps/productsMetaStep";

export default createGame({
  id: "azul",
  name: "Azul",
  productsMetaStep,
  products: {
    base: {
      name: "Azul",
      year: 2017,
      bggId: 230802,
      isNotImplemented: true,
    },
    crystal: {
      name: "Crystal Mosaic",
      bggId: 294345,
      year: 2020,
      isNotImplemented: true,
    },
    joker: {
      name: "Joker Tiles",
      bggId: 235739,
      year: 2017,
      isNotImplemented: true,
    },
    factories: {
      name: "Special Factories Promo",
      bggId: 264017,
      year: 2018,
      isNotImplemented: true,
    },
  },
  steps: [],
});
