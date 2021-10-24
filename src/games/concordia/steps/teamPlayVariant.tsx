import { Typography } from "@mui/material";
import { playersMetaStep } from "games/core/steps/createPlayersDependencyMetaStep";
import { createVariant } from "games/core/steps/createVariant";
import productsMetaStep from "./productsMetaStep";

const baseTeamPlayVariant = createVariant({
  id: "teams",
  name: "Teams",
  dependencies: [playersMetaStep, productsMetaStep],
  isTemplatable: (players, products) =>
    players.count(4) && products.willContainAny(["venus", "venusBase"]),
  InstanceVariableComponent,
});

/**
 * Team Play is always on when there are 6 players, the game is not playable
 * without this variant on. To make this possible we can't simply use the basic
 * variant builder. What we can do is use the basic builder as a "base"
 * implementation, and then use those implemented methods in our raw impl. This
 * makes most of the additional logic straightforward and easy to understand.
 */
const teamPlayVariant: typeof baseTeamPlayVariant = Object.freeze({
  ...baseTeamPlayVariant,

  skip: (context) =>
    baseTeamPlayVariant.skip(context) && context.playerIds.length !== 6,

  hasValue: (context) =>
    baseTeamPlayVariant.hasValue(context) || context.playerIds.length === 6,

  extractInstanceValue: (upstreamInstance, context) =>
    baseTeamPlayVariant.extractInstanceValue(upstreamInstance, context) ??
    (context.playerIds.length === 6 ? true : null),

  query: (template, context) => {
    const baseQuery = baseTeamPlayVariant.query(template, context);
    return {
      ...baseQuery,
      canResolveTo: (value) =>
        context.playerIds.length === 6 ? value : baseQuery.canResolveTo(value),
    };
  },

  InstanceManualComponent: InstanceVariableComponent,
});

export default teamPlayVariant;

function InstanceVariableComponent(): JSX.Element {
  return (
    <Typography variant="body1">
      Players pair up and win or lose together, playing off each other's cards.
    </Typography>
  );
}

