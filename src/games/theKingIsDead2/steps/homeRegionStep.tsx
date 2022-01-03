import { Chip, Typography } from "@mui/material";
import { Vec } from "common";
import { createDerivedGameStep } from "games/core/steps/createDerivedGameStep";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import React from "react";
import { Factions } from "../utils/Factions";
import { Followers } from "../utils/Followers";
import { REGION_NAME } from "../utils/Regions";
import followersStep from "./followersStep";

export default createDerivedGameStep({
  id: "homeRegions",
  dependencies: [followersStep],
  skip: ([followersIndex]) => followersIndex != null,
  InstanceDerivedComponent: () => (
    <Typography variant="body1" textAlign="justify">
      Place{" "}
      <GrammaticalList>
        {Vec.map_with_key(
          Factions,
          (factionId, { name, homeRegion, color }) => (
            <React.Fragment key={factionId}>
              <strong>{Followers.NUM_PER_HOME_REGION}</strong>{" "}
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
