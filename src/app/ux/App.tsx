import { CssBaseline, ThemeProvider } from "@mui/material";
import { store } from "app/store";
import { themeWithGameColors } from "app/ux/themeWithGameColors";
import { Provider } from "react-redux";
import { Chrome } from "./Chrome";
import { ErrorBoundary } from "./ErrorBoundary";

export function App(): JSX.Element | null {
  return (
    <Provider store={store}>
      <CssBaseline />
      <ErrorBoundary>
        <ThemeProvider theme={themeWithGameColors}>
          <Chrome />
        </ThemeProvider>
      </ErrorBoundary>
    </Provider>
  );
}
