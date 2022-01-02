import { Chip, Typography } from "@mui/material";
import { Vec } from "common";
import { createGame } from "games/core/Game";
import { createGameStep } from "games/core/steps/createGameStep";
import { createProductsMetaStep } from "games/core/steps/createProductDependencyMetaStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import React from "react";
import bagStep from "./steps/bagStep";
import courtStep from "./steps/courtStep";
import firstPlayerStep from "./steps/firstPlayerStep";
import playOrderStep from "./steps/playOrderStep";
import { Factions } from "./utils/Factions";
import { REGION_NAME } from "./utils/Regions";

const productsMetaStep = createProductsMetaStep();

export default createGame({
  id: "theKingIsDead2",
  name: "The King is Dead: Second Edition",
  productsMetaStep,
  products: {
    base: {
      name: "The King is Dead: Second Edition",
      isBase: true,
      year: 2020,
      bggId: 319966,
    },
  },
  steps: [
    createGameStep({
      id: "board",
      InstanceManualComponent: "Place the board in the middle of the table.",
    }),
    createGameStep({
      id: "homeRegions",
      InstanceManualComponent: () => (
        <Typography variant="body1" textAlign="justify">
          Place{" "}
          <GrammaticalList>
            {Vec.map_with_key(
              Factions,
              (factionId, { name, homeRegion, color }) => (
                <React.Fragment key={factionId}>
                  <strong>2</strong>{" "}
                  <Chip size="small" color={color} label={name} /> followers in{" "}
                  <strong>
                    <em>{REGION_NAME[homeRegion]}</em>
                  </strong>
                </React.Fragment>
              )
            )}
          </GrammaticalList>
          .
        </Typography>
      ),
    }),
    bagStep,

    firstPlayerStep,
    playOrderStep,

    courtStep,
  ],
});
