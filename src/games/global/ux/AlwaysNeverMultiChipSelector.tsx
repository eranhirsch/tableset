import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import { Box, Chip } from "@mui/material";
import { Vec } from "common";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { GamePiecesColor } from "model/GamePiecesColor";
import React from "react";

type AlwaysNeverDefinition<T> = {
  always: readonly T[];
  never: readonly T[];
};

type Limits = { min: number; max: number };

type Mode = "always" | "never" | "random";

export function AlwaysNeverMultiChipSelector<T>({
  itemIds,
  getLabel,
  getColor,
  value,
  onChange,
  limits,
}: {
  itemIds: readonly T[];
  getLabel(itemId: T): string;
  getColor?(itemId: T): GamePiecesColor;
  value: Readonly<AlwaysNeverDefinition<T>>;
  onChange(
    changed: (
      current: Readonly<AlwaysNeverDefinition<T>>
    ) => Readonly<AlwaysNeverDefinition<T>>
  ): void;
  limits: Readonly<Limits>;
}): JSX.Element {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
      {Vec.map(itemIds, (itemId) => (
        <AlwaysNeverChip
          key={`${itemId}`}
          label={getLabel(itemId)}
          color={getColor?.(itemId)}
          mode={currentMode(value, itemId)}
          onClick={() =>
            onChange((current) =>
              switchModes(
                current,
                itemId,
                currentMode(current, itemId),
                nextMode(current, itemId, limits, itemIds.length)
              )
            )
          }
        />
      ))}
    </Box>
  );
}

function AlwaysNeverChip({
  label,
  mode,
  color,
  onClick,
}: {
  label: string;
  mode: Mode;
  color?: GamePiecesColor;
  onClick(): void;
}): JSX.Element {
  return (
    <Chip
      sx={{
        opacity: mode === "never" ? 0.75 : 1.0,
        marginX:
          mode === "random" ? "14px" : mode === "never" ? "4px" : undefined,
      }}
      color={color}
      icon={
        mode === "always" ? (
          <CheckCircleIcon fontSize="small" />
        ) : mode === "never" ? (
          <NotInterestedRoundedIcon fontSize="small" />
        ) : undefined
      }
      variant={mode === "never" ? "outlined" : "filled"}
      label={
        mode === "always" ? (
          <strong>{label}</strong>
        ) : mode === "never" ? (
          <em>{label}</em>
        ) : (
          label
        )
      }
      onClick={onClick}
    />
  );
}

const currentMode = <T,>(
  { always, never }: Readonly<AlwaysNeverDefinition<T>>,
  itemId: T
): Mode =>
  always.includes(itemId)
    ? "always"
    : never.includes(itemId)
    ? "never"
    : "random";

function nextMode<T>(
  config: Readonly<AlwaysNeverDefinition<T>>,
  itemId: T,
  { min, max }: Limits,
  totalItems: number
): Mode {
  const alwaysEnabled = config.always.length < max;
  const neverEnabled = totalItems - config.never.length > min;

  switch (currentMode(config, itemId)) {
    case "always":
      return neverEnabled ? "never" : "random";
    case "never":
      return "random";
    case "random":
      return alwaysEnabled ? "always" : neverEnabled ? "never" : "random";
  }
}

function switchModes<T>(
  config: Readonly<AlwaysNeverDefinition<T>>,
  itemId: T,
  currentMode: Mode,
  nextMode: Mode
): Readonly<AlwaysNeverDefinition<T>> {
  switch (currentMode) {
    case "always":
      switch (nextMode) {
        case "always":
          return config;
        case "never":
          return {
            always: Vec.filter(config.always, (x) => x !== itemId),
            never: Vec.sort(Vec.concat(config.never, itemId)),
          };
        case "random":
          return {
            ...config,
            always: Vec.filter(config.always, (x) => x !== itemId),
          };
      }
      break;

    case "never":
      switch (nextMode) {
        case "always":
          return {
            always: Vec.sort(Vec.concat(config.always, itemId)),
            never: Vec.filter(config.never, (x) => x !== itemId),
          };
        case "never":
          return config;
        case "random":
          return {
            ...config,
            never: Vec.filter(config.never, (x) => x !== itemId),
          };
      }
      break;

    case "random":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, itemId)),
          };
        case "never":
          return {
            ...config,
            never: Vec.sort(Vec.concat(config.never, itemId)),
          };
        case "random":
          return config;
      }
  }
}

export function AlwaysNeverMultiLabel<T>({
  value: { always, never },
  getColor,
  getLabel,
  limits: { min, max },
}: {
  value: AlwaysNeverDefinition<T>;
  getColor?(itemId: T): GamePiecesColor;
  getLabel(itemId: T): string;
  limits: Limits;
}): JSX.Element {
  if (Vec.is_empty(never) && Vec.is_empty(always)) {
    return <>Random</>;
  }

  if (Vec.is_empty(always)) {
    return (
      <>
        Without{" "}
        <GrammaticalList>
          {Vec.map(never, (itemId) => (
            <Chip
              key={`${itemId}`}
              component="span"
              color={getColor?.(itemId)}
              size="small"
              label={getLabel(itemId)}
            />
          ))}
        </GrammaticalList>
      </>
    );
  }

  if (always.length === max) {
    return (
      <GrammaticalList>
        {Vec.map(always, (itemId) => (
          <Chip
            key={`${itemId}`}
            component="span"
            color={getColor?.(itemId)}
            size="small"
            label={getLabel(itemId)}
          />
        ))}
      </GrammaticalList>
    );
  }

  return (
    <>
      With{" "}
      <GrammaticalList>
        {Vec.map(always, (itemId) => (
          <Chip
            key={`${itemId}`}
            component="span"
            color={getColor?.(itemId)}
            size="small"
            label={getLabel(itemId)}
          />
        ))}
      </GrammaticalList>
      {!Vec.is_empty(never) && (
        <>
          {" "}
          (and without{" "}
          <GrammaticalList finalConjunction="or">
            {React.Children.toArray(Vec.map(never, getLabel))}
          </GrammaticalList>
          )
        </>
      )}
    </>
  );
}