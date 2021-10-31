import { Box, ThemeProvider } from "@mui/material";
import { themeWithGameColors } from "app/ux/themeWithGameColors";
import { TableSetAppBar } from "./AppBar";
import { ErrorBoundary } from "./ErrorBoundary";
import { FeaturesNav } from "./FeaturesNav";
import { Main } from "./Main";

export default function App(): JSX.Element | null {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={themeWithGameColors}>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          overflow="hidden"
        >
          <TableSetAppBar />
          <Main />
          <FeaturesNav />
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}


