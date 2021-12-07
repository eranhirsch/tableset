import { Box, Chip, Paper, Typography } from "@mui/material";
import { Random } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import {
  createRandomGameStep,
  InstanceCardsProps,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { NoConfigPanel } from "games/core/steps/NoConfigPanel";

const DICE_SIZE = 80;

export default createRandomGameStep({
  id: "decoder",
  dependencies: [],

  isTemplatable: () => true,

  resolve: () => Random.int(10, 130),

  InstanceVariableComponent,
  InstanceCards,

  instanceAvroType: "int",

  ...NoConfigPanel,
});

function InstanceVariableComponent({
  value: idx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const whiteDie = idx % 10;
  const blackDie = Math.floor(idx / 10);
  return (
    <>
      <Typography variant="body1">
        Use the table printed on the back of the player mat to secretly find out
        who the scapegoat is - or if you are the scapegoat, who you think the
        scapegoat is. <Chip size="small" color="white" label="White" /> refers
        to the white vertical column of numbers, and{" "}
        <Chip size="small" color="black" label="Black" /> refers to the black
        horizontal row of numbers.{" "}
      </Typography>
      <Box display="flex" justifyContent="space-around" marginTop={4}>
        <Paper
          elevation={10}
          sx={{
            borderRadius: 2,
            width: DICE_SIZE,
            height: DICE_SIZE,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">
            <pre>
              <strong>{whiteDie}</strong>
            </pre>
          </Typography>
        </Paper>
        <Paper
          elevation={10}
          sx={{
            borderRadius: 2,
            width: DICE_SIZE,
            height: DICE_SIZE,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "black",
          }}
        >
          <Typography variant="h4" color="#fff">
            <pre>
              <strong>{blackDie}</strong>
            </pre>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}

function InstanceCards({
  value: idx,
  onClick,
}: InstanceCardsProps<number>): JSX.Element {
  const whiteDie = idx % 10;
  const blackDie = Math.floor(idx / 10);

  return (
    <InstanceCard onClick={onClick} title="Decoder">
      <Box display="flex" justifyContent="space-evenly" width="100%">
        <Paper
          variant="outlined"
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption">
            <pre>
              <strong>{whiteDie}</strong>
            </pre>
          </Typography>
        </Paper>
        <Paper
          variant="outlined"
          sx={{
            width: 32,
            height: 32,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "black",
          }}
        >
          <Typography variant="caption" color="#fff">
            <pre>
              <strong>{blackDie}</strong>
            </pre>
          </Typography>
        </Paper>
      </Box>
    </InstanceCard>
  );
}
