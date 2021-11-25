import { List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";
import { IndexHashCaption } from "games/core/ux/IndexHashCaption";
import { IndexHashInstanceCard } from "games/core/ux/IndexHashInstanceCards";
import { isIndexType } from "games/global/coercers/isIndexType";
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
import teamPlayVariant from "./teamPlayVariant";
import venusScoringVariant from "./venusScoringVariant";

export default createRandomGameStep({
  id: "marketDisplay",
  labelOverride: "Initial Cards in Market",

  isType: isIndexType,

  dependencies: [venusScoringVariant, teamPlayVariant],

  InstanceVariableComponent,
  InstanceManualComponent,

  isTemplatable: () => true,
  resolve: (_, venusScoring, teamPlay) =>
    MarketDisplayEncoder.randomIdx(
      (venusScoring ?? false) || (teamPlay ?? false)
    ),

  ...NoConfigPanel,

  InstanceCards: (props) => <IndexHashInstanceCard title="Market" {...props} />,

  instanceAvroType: "int",
});

function InstanceVariableComponent({
  value: index,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const venusScoring = useOptionalInstanceValue(venusScoringVariant);
  const teamPlay = useRequiredInstanceValue(teamPlayVariant);

  const market = useMemo(
    () =>
      MarketDisplayEncoder.decode(
        index,
        (venusScoring ?? false) || (teamPlay ?? false)
      ),
    [index, teamPlay, venusScoring]
  );

  return (
    <Stack>
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
      <List component="ol">
        {market.map((cardName) => (
          <ListItem key={cardName} dense>
            <ListItemText primaryTypographyProps={{ variant: "body2" }}>
              <RomanTitle>{cardName}</RomanTitle>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <IndexHashCaption idx={index} />
    </Stack>
  );
}

function InstanceManualComponent(): JSX.Element {
  const venusScoring = useOptionalInstanceValue(venusScoringVariant);
  const teamPlay = useRequiredInstanceValue(teamPlayVariant);

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
        {!venusScoring && !teamPlay && (
          <>
            ; <em>the deck should have 1 card remaining</em>
          </>
        )}
        .
      </>
    </HeaderAndSteps>
  );
}
