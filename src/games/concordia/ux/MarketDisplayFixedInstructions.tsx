import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import { VariableStepInstanceComponentProps } from "../../core/steps/createVariableGameStep";
import MarketDisplayEncoder from "../utils/MarketDisplayEncoder";

export default function MarketDisplayFixedInstructions({
  value: hash,
}: VariableStepInstanceComponentProps<string>) {
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
