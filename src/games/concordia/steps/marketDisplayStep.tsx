import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { templateValue } from "features/template/templateSlice";
import { NoSettingsConfigPanel } from "games/core/ux/NoSettingsConfigPanel";
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

export default createRandomGameStep({
  id: "marketDisplay",
  labelOverride: "Cards Display",

  dependencies: [],

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: () => true,
  resolve: () => MarketDisplayEncoder.randomHash(),
  initialConfig: () => ({ random: true }),
  refresh: () => templateValue("unchanged"),

  ConfigPanel: NoSettingsConfigPanel,
});

function InstanceVariableComponent({
  value: hash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const market = MarketDisplayEncoder.decode(hash);
  return (
    <>
      <BlockWithFootnotes
        footnotes={[
          <>
            Set aside previously in <InstanceStepLink step={marketCardsStep} />
          </>,
        ]}
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
  return (
    <HeaderAndSteps synopsis="Fill the personality cards market display:">
      <BlockWithFootnotes
        footnotes={[
          <>
            Set aside previously in <InstanceStepLink step={marketCardsStep} />
          </>,
        ]}
      >
        {(Footnote) => (
          <>
            Shuffle the <strong>I</strong> personality cards deck
            <Footnote />.
          </>
        )}
      </BlockWithFootnotes>
      <>
        Deal cards from the deck placing them one-by-one into the market slots;{" "}
        <em>the deck should have 1 card remaining.</em>
      </>
    </HeaderAndSteps>
  );
}
