import {
  Box,
  Collapse,
  Divider,
  Link,
  Typography,
  useTheme
} from "@mui/material";
import React, { useState } from "react";

export function BlockWithFootnotes(props: {
  footnotes: readonly JSX.Element[];
  children: (
    footnote: (props: { index: number }) => JSX.Element
  ) => JSX.Element;
}): JSX.Element;
export function BlockWithFootnotes(props: {
  footnote: JSX.Element;
  children: (footnote: (props: {}) => JSX.Element) => JSX.Element;
}): JSX.Element;
export function BlockWithFootnotes({
  children: main,
  footnote,
  footnotes,
}: {
  footnotes?: readonly JSX.Element[];
  footnote?: JSX.Element;
  children: (
    footnote: (props: { index?: number }) => JSX.Element
  ) => JSX.Element;
}): JSX.Element {
  const theme = useTheme();

  const [showFootnotes, setShowFootnotes] = useState(false);

  if (footnotes == null) {
    footnotes = [footnote!];
  }

  return (
    <>
      {main(({ index = 1 }) => (
        <Link
          component="sup"
          href="#"
          underline="hover"
          onClick={(event) => {
            setShowFootnotes(true);
            event.preventDefault();
          }}
        >
          [{index}]
        </Link>
      ))}
      <Collapse in={showFootnotes}>
        <Divider sx={{ marginTop: theme.spacing(2) }} />
        <Box component="ol" sx={{ paddingInlineStart: theme.spacing(3) }}>
          {footnotes.map((footnote, idx) => (
            <Typography
              key={`footnote_${idx}`}
              component="li"
              variant="caption"
            >
              {footnote}
            </Typography>
          ))}
        </Box>
        <Link
          href="#"
          variant="caption"
          underline="hover"
          onClick={(event) => {
            setShowFootnotes(false);
            event.preventDefault();
          }}
        >
          Show less
        </Link>
      </Collapse>
    </>
  );
}
