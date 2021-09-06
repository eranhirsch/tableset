import React from "react";

export default function GrammaticalList({
  children,
}: {
  children: (JSX.Element | string)[];
}): JSX.Element | null {
  if (children.length === 1) {
    return <>{children[0]}</>;
  }

  if (children.length === 2) {
    return (
      <>
        {children[0]} and {children[1]}
      </>
    );
  }

  return (
    <>
      {children.slice(0, children.length - 1).map((child, idx) => (
        <React.Fragment key={`grammatical_${idx}`}>{child}, </React.Fragment>
      ))}{" "}
      and {children[children.length - 1]}
    </>
  );
}
