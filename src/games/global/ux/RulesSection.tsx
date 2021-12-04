import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

export function RulesSection({
  children,
}: React.PropsWithChildren<{}>): JSX.Element {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <Typography
        variant="subtitle1"
        color="primary"
        marginTop={2}
        onClick={() => setShowRules((current) => !current)}
        display="flex"
        alignItems="center"
      >
        {showRules ? <ExpandLessIcon /> : <ExpandMoreIcon />} Rules
      </Typography>
      <Collapse in={showRules}>
        <Stack direction="column" spacing={1} paddingX={2} textAlign="justify">
          {React.Children.map(children, (child) => (
            <Typography variant="body2">{child}</Typography>
          ))}
        </Stack>
      </Collapse>
    </>
  );
}
