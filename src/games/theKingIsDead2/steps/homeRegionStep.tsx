import { Chip, Typography } from "@mui/material";
import { Vec } from "common";
import { createGameStep } from "games/core/steps/createGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import React from "react";
import { Factions } from "../utils/Factions";
import { REGION_NAME } from "../utils/Regions";

export const NUM_CUBES_PER_HOME_REGION = 2;

export default createGameStep({
  id: "homeRegions",
  InstanceManualComponent: () => (
    <Typography variant="body1" textAlign="justify">
      Place{" "}
      <GrammaticalList>
        {Vec.map_with_key(
          Factions,
          (factionId, { name, homeRegion, color }) => (
            <React.Fragment key={factionId}>
              <strong>{NUM_CUBES_PER_HOME_REGION}</strong>{" "}
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
});
