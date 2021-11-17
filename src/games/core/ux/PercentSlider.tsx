import { Slider } from "@mui/material";
import { type_invariant } from "common";

export function PercentSlider({
  percent,
  onChange,
  preventZero = false,
  disabled = false,
  track = "normal",
}: {
  percent: number;
  onChange(percent: number): void;
  preventZero?: boolean;
  disabled?: boolean;
  track?: "normal" | false;
}): JSX.Element {
  return (
    <Slider
      track={track}
      disabled={disabled}
      value={percent}
      min={0}
      max={100}
      step={5}
      marks={[{ value: 50, label: "" }]}
      onChange={(_, newValue) =>
        newValue !== percent && (!preventZero || newValue !== 0)
          ? onChange(type_invariant(newValue, isNumber))
          : undefined
      }
    />
  );
}

const isNumber = (x: unknown): x is number => typeof x === "number";
