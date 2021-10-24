import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  resetSliceInLocalStorage,
  resetStateInLocalStorage,
} from "app/persist";
import { Str } from "common";
import React, { ErrorInfo, ReactNode } from "react";

interface Props {
  slice?: string;
}

interface State {
  hasError: boolean;
}

const INITIAL_STATE: State = { hasError: false };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  static getDerivedStateFromError(_error: any): Partial<State> | null {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(error, errorInfo);
  }

  render(): ReactNode {
    return this.state.hasError ? this.renderFallback() : this.props.children;
  }

  renderFallback(): JSX.Element {
    const { slice } = this.props;
    return (
      <Dialog open={true}>
        <DialogTitle>Something Went Wrong</DialogTitle>
        <DialogContent>
          <DialogContentText>
            An error is preventing us from rendering{" "}
            {slice != null ? `the ${slice} feature` : "the app"}. This might be
            due to a feature that corrupted the state of the app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              slice != null
                ? resetSliceInLocalStorage(slice)
                : resetStateInLocalStorage();
              window.location.assign("/");
            }}
          >
            Reset {slice != null ? Str.capitalize(slice) : "App"} State
          </Button>
          {slice != null && (
            <Button
              onClick={() => {
                resetStateInLocalStorage();
                window.location.assign("/");
              }}
              autoFocus
            >
              Reset App State
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}
