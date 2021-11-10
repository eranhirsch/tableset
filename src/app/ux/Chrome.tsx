import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactUtils, Vec } from "common";
import { Link, Outlet } from "react-router-dom";
import { FeaturesNav } from "./FeaturesNav";
import { OverflowMenu } from "./OverflowMenu";

export type ToolbarButton = [icon: JSX.Element, url: string];

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
  buttons = [],
  element,
  children,
}: React.PropsWithChildren<{
  title?: string;
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
            {Vec.map(buttons, ([icon, url]) => (
              <IconButton component={Link} color="inherit" to={url}>
                {icon}
              </IconButton>
            ))}
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
        {element ?? children}
      </Container>
    </>
  );
}