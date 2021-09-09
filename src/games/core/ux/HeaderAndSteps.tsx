import { Stack, Typography, useTheme } from "@material-ui/core";
import React from "react";

export default function HeaderAndSteps({
  synopsis,
  children,
}: {
  synopsis: JSX.Element | string;
  children: (JSX.Element | string)[];
}): JSX.Element {
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
        {children.map((child, index) => (
          <Typography key={`child_${index}`} component="li" variant="body2">
            {child}
          </Typography>
        ))}
      </Stack>
    </>
  );
}
