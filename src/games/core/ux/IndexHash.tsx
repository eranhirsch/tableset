import { Typography } from "@mui/material";
import { Num } from "common";

export function IndexHash({ idx }: { idx: number }): JSX.Element {
  return (
    <Typography variant="caption" sx={{ marginTop: 2 }}>
      <pre>Hash: {Num.encode_base32(idx)}</pre>
    </Typography>
  );
}
