import { Stack, Typography, useTheme } from "@mui/material";
import React, { PropsWithChildren } from "react";

export function HeaderAndSteps({
  synopsis,
  children,
}: PropsWithChildren<{
  synopsis: JSX.Element | string;
}>): JSX.Element {
  const theme = useTheme();

  return (
    <>
      {typeof synopsis === "string" ? (
        <Typography variant="body1">{synopsis}</Typography>
      ) : (
        synopsis
      )}
      <Stack
        component="ol"
        sx={{ paddingInlineStart: theme.spacing(2) }}
        spacing={2}
      >
        {React.Children.map(
          children,
          (child) =>
            child != null && (
              <Typography component="li" variant="body2">
                {child}
              </Typography>
            )
        )}
      </Stack>
    </>
  );
}
