import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactUtils, Vec } from "common";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FeaturesNav } from "./FeaturesNav";
import { OverflowMenu } from "./OverflowMenu";

export type ToolbarButton = [icon: JSX.Element, target: string | (() => void)];

export function Chrome(): JSX.Element {
  return (
    <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
      {/* Outlets should always be TSPages */}
      <Outlet />
      <FeaturesNav />
    </Box>
  );
}

export function TSPage({
  title,
  header,
  buttons = [],
  element,
  children,
}: React.PropsWithChildren<{
  title?: string;
  header?: string;
  element?: React.ReactElement;
  buttons?: readonly ToolbarButton[];
}>): JSX.Element {
  return (
    <>
      {title != null && (
        <AppBar component="header" position="sticky" sx={{ flexGrow: 0 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
            {React.Children.toArray(
              Vec.map(buttons, ([icon, target]) =>
                typeof target === "string" ? (
                  <IconButton component={Link} color="inherit" to={target}>
                    {icon}
                  </IconButton>
                ) : (
                  <IconButton color="inherit" onClick={target}>
                    {icon}
                  </IconButton>
                )
              )
            )}
            <OverflowMenu />
          </Toolbar>
        </AppBar>
      )}
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          flexGrow: 1,
          position: "relative",
          ...ReactUtils.SX_SCROLL_WITHOUT_SCROLLBARS,
        }}
      >
        {header && (
          <Typography component="header" variant="h2">
            {header}
          </Typography>
        )}
        {element ?? children}
      </Container>
    </>
  );
}
