import { $, Vec } from "common";
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function useNavigateToSibling(): (sibling: string) => void {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (sibling: string) =>
      $(
        location.pathname,
        ($$) => $$.split("/"),
        ($$) => Vec.take($$, $$.length - 1),
        ($$) => Vec.concat($$, sibling),
        ($$) => $$.join("/"),
        ($$) => navigate($$)
      ),
    [location.pathname, navigate]
  );
}

function useNavigateToChild(): (child: string) => void {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    (child: string) =>
      $(
        location.pathname,
        ($$) => `${$$}${$$.endsWith("/") ? "" : "/"}${child}`,
        ($$) => navigate($$)
      ),
    [location.pathname, navigate]
  );
}

function useNavigateToParent(): () => void {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    () =>
      $(
        location.pathname,
        ($$) => $$.split("/"),
        ($$) => Vec.take($$, $$.length - 1),
        ($$) => $$.join("/"),
        ($$) => navigate($$)
      ),
    [location.pathname, navigate]
  );
}

export const Router = {
  useNavigateToChild,
  useNavigateToParent,
  useNavigateToSibling,
} as const;
