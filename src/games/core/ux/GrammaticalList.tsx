import React from "react";

export default function GrammaticalList({
  children,
  pluralize,
}: {
  children: readonly (JSX.Element | string)[];
  pluralize?: string;
}): JSX.Element | null {
  if (children.length === 1) {
    return (
      <>
        {pluralize != null && <>the {pluralize} </>}
        {children[0]}
      </>
    );
  }

  const prefix = pluralize != null ? `${pluralize}s` : "";

  if (children.length === 2) {
    return (
      <>
        {prefix} {children[0]} and {children[1]}
      </>
    );
  }

  return (
    <>
      {prefix}{" "}
      {children.slice(0, children.length - 1).map((child, idx) => (
        <React.Fragment key={`grammatical_${idx}`}>{child}, </React.Fragment>
      ))}{" "}
      and {children[children.length - 1]}
    </>
  );
}
