import { Typography, useTheme } from "@mui/material";
import { GamePiecesColor } from "model/GamePiecesColor";

export function ChosenElement({
  children,
  extraInfo,
  color,
}: React.PropsWithChildren<{
  extraInfo?: string;
  color?: GamePiecesColor;
}>): JSX.Element {
  const theme = useTheme();

  return (
    <Typography
      component="span"
      color="primary"
      sx={color != null ? { color: theme.palette[color].main } : {}}
    >
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
