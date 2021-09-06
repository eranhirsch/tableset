import {
  Box,
  Collapse,
  Divider,
  Typography,
  useTheme,
  Link,
} from "@material-ui/core";
import React, { useState } from "react";

export function BlockWithFootnotes({
  children: main,
  footnotes,
}: {
  footnotes: JSX.Element[];
  children: (
    footnote: (props: { index: number }) => JSX.Element
  ) => JSX.Element;
}) {
  const theme = useTheme();

  const [showFootnotes, setShowFootnotes] = useState(false);

  return (
    <>
      {main(({ index }) => (
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
              component="li"
              variant="caption"
              key={`footnote_${idx}`}
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
