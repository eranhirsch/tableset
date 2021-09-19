import { Children, ReactChild, ReactFragment, ReactPortal } from "react";

export default function GrammaticalList({
  children,
  pluralize,
}: {
  children: readonly (ReactChild | ReactFragment | ReactPortal | string)[];
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
      {Children.toArray(
        children
          .slice(0, children.length - 1)
          .map((child, idx) => <>{child}, </>)
      )}{" "}
      and {children[children.length - 1]}
    </>
  );
}
