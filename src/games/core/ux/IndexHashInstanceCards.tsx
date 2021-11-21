import { Typography } from "@mui/material";
import { Num } from "common";
import { InstanceCard } from "features/instance/InstanceCard";
import { InstanceCardsProps } from "../steps/createRandomGameStep";

const SEPARATOR = `-`;

export function IndexHashInstanceCard({
  title,
  subheader,
  value: index,
  onClick,
}: { title: string; subheader?: string } & InstanceCardsProps<
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
    <InstanceCard title={title} subheader={subheader} onClick={onClick}>
      <Typography variant="h6" color="primary">
        <strong>{Num.encode_base32(index, SEPARATOR)}</strong>
      </Typography>
    </InstanceCard>
  );
}
