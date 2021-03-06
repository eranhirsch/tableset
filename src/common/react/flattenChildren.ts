import {
  ReactNode,
  ReactChild,
  Children,
  isValidElement,
  cloneElement,
} from "react";
import { isFragment } from "react-is";

/**
 * Copied from https://github.com/grrowl/react-keyed-flatten-children (on
 * September 9, 2021) to save on requiring a redundant tiny dependencies, and
 * then renamed for more clarity.
 * @see https://www.npmjs.com/package/react-keyed-flatten-children
 */
function flattenChildren(
  children: ReactNode,
  depth: number = 0,
  keys: (string | number)[] = []
): ReactChild[] {
  return Children.toArray(children).reduce(
    (acc: ReactChild[], node, nodeIndex) => {
      if (isFragment(node)) {
        acc.push.apply(
          acc,
          flattenChildren(
            node.props.children,
            depth + 1,
            keys.concat(node.key || nodeIndex)
          )
        );
      } else {
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
              key: keys.concat(String(node.key)).join("."),
            })
          );
        } else if (typeof node === "string" || typeof node === "number") {
          acc.push(node);
        }
      }
      return acc;
    },
    []
  );
}

export const ReactUtils = {
  flattenChildren,
} as const;
