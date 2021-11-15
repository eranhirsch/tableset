import { styled } from "@mui/material";
import { Random, Vec } from "common";
import React from "react";
import { GrammaticalList } from "./GrammaticalList";

const Error = styled("span")(({ theme }) => ({
  color: theme.palette.error.main,
}));

export function AbbreviatedList({
  noun = "item",
  finalConjunction,
  children,
}: React.PropsWithChildren<{
  noun?: string;
  finalConjunction?: string;
}>): JSX.Element {
  if (React.Children.count(children) === 0) {
    return <Error>Error: None!</Error>;
  }

  return (
    <GrammaticalList finalConjunction={finalConjunction}>
      {Vec.concat(
        Random.sample(React.Children.toArray(children), 2),
        React.Children.count(children) > 2
          ? [
              <>
                {React.Children.count(children) - 2} other {noun}
                {React.Children.count(children) > 3 && "s"}
              </>,
            ]
          : []
      )}
    </GrammaticalList>
  );
}
