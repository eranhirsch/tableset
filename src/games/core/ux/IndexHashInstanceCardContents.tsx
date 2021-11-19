import { Typography } from "@mui/material";
import { Num } from "common";
import { InstanceCardContentsProps } from "../steps/createRandomGameStep";

const SEPARATOR = "-";

export function IndexHashInstanceCardContents({
  value: index,
}: InstanceCardContentsProps<
  number,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>): JSX.Element {
  return (
    <Typography variant="h6" color="primary">
      <strong>
        <pre>{Num.encode_base32(index, SEPARATOR)}</pre>
      </strong>
    </Typography>
  );
}
