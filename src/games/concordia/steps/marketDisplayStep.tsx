import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { InstanceStepLink } from "../../../features/instance/InstanceStepLink";
import createVariableGameStep, {
  VariableStepInstanceComponentProps,
} from "../../core/steps/createVariableGameStep";
import { BlockWithFootnotes } from "../../core/ux/BlockWithFootnotes";
import HeaderAndSteps from "../../core/ux/HeaderAndSteps";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";
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
    <Stack direction="column" alignItems="center">
      <TableContainer>
        <Table size="small">
          <TableBody>
            {market.map((cardName) => (
              <TableRow key={cardName}>
                <TableCell>
                  <Typography variant="body2">{cardName}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption">Hash: {hash}</Typography>
    </Stack>
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
            Shuffle the <strong>I</strong> cards deck
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
