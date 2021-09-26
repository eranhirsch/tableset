import { List, ListItem, ListItemText, Typography } from "@mui/material";
import { InstanceStepLink } from "../../../features/instance/InstanceStepLink";
import {
  createVariableGameStep,
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
import RomanTitle from "../ux/RomanTitle";
import marketCardsStep from "./marketCardsStep";

export default createVariableGameStep({
  id: "marketDisplay",
  labelOverride: "Cards Display",

  InstanceVariableComponent,
  InstanceManualComponent,

  random: () => MarketDisplayEncoder.randomHash(),
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
            <Footnote index={1} /> :
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
            <Footnote index={1} />.
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
