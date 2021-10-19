import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { useOptionalInstanceValue } from "features/instance/useInstanceValue";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { useMemo } from "react";
import { InstanceStepLink } from "../../../features/instance/InstanceStepLink";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createRandomGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import { HeaderAndSteps } from "../../core/ux/HeaderAndSteps";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
import RomanTitle from "../ux/RomanTitle";
import marketCardsStep from "./marketCardsStep";
import venusScoringVariant from "./venusScoringVariant";

export default createRandomGameStep({
  id: "marketDisplay",
  labelOverride: "Initial Cards in Market",

  dependencies: [venusScoringVariant],

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: () => true,
  resolve: (_, venusScoring) =>
    MarketDisplayEncoder.randomHash(venusScoring ?? false),

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const venusScoring = useOptionalInstanceValue(venusScoringVariant);

  const market = useMemo(
    () => MarketDisplayEncoder.decode(venusScoring ?? false, hash),
    [hash, venusScoring]
  );

  return (
    <>
      <BlockWithFootnotes
        footnote={<InstanceStepLink step={marketCardsStep} />}
      >
        {(Footnote) => (
          <Typography variant="body1">
            Fill the personality cards market display from left to right using
            the cards in deck <strong>I</strong>
            <Footnote /> :
          </Typography>
        )}
      </BlockWithFootnotes>
      <figure>
        <List component="ol">
          {market.map((cardName) => (
            <ListItem key={cardName} dense>
              <ListItemText primaryTypographyProps={{ variant: "body2" }}>
                <RomanTitle>{cardName}</RomanTitle>
              </ListItemText>
            </ListItem>
          ))}
          <Typography component="figcaption" variant="caption">
            <pre>Hash: {hash}</pre>
          </Typography>
        </List>
      </figure>
    </>
  );
}

function InstanceManualComponent(): JSX.Element {
  const venusScoring = useOptionalInstanceValue(venusScoringVariant);

  return (
    <HeaderAndSteps synopsis="Fill the personality cards market display:">
      <BlockWithFootnotes
        footnote={<InstanceStepLink step={marketCardsStep} />}
      >
        {(Footnote) => (
          <>
            Shuffle the <strong>I</strong> personality cards deck
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Deal cards from the deck placing them one-by-one into the market slots
        {!venusScoring && (
          <>
            ; <em>the deck should have 1 card remaining</em>
          </>
        )}
        .
      </>
    </HeaderAndSteps>
  );
}
