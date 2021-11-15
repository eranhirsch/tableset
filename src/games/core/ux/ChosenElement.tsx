import { Typography } from "@mui/material";

export function ChosenElement({
  children,
  extraInfo,
}: React.PropsWithChildren<{ extraInfo?: string }>): JSX.Element {
  return (
    <Typography component="span" color="primary">
      <strong>{children}</strong>
      {extraInfo != null && (
        <>
          {"\u00A0"}
          {extraInfo}
        </>
      )}
    </Typography>
  );
}
