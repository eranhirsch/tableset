import { Typography } from "@mui/material";
import { Num } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { InstanceCardsProps } from "../steps/createRandomGameStep";

const SEPARATOR = "-";

export function IndexHashInstanceCard({
  title,
  value: index,
}: { title: string } & InstanceCardsProps<
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
    <InstanceCard title={title}>
      <Typography variant="h6" color="primary">
        <strong>
          <pre>{Num.encode_base32(index, SEPARATOR)}</pre>
        </strong>
      </Typography>
    </InstanceCard>
  );
}
