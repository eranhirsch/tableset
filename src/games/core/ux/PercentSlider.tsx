import { Slider } from "@mui/material";
import { type_invariant } from "common";

export function PercentSlider({
  percent,
  onChange,
  preventZero = false,
  disabled = false,
}: {
  percent: number | undefined;
  onChange(percent: number): void;
  preventZero?: boolean;
  disabled?: boolean;
}): JSX.Element {
  return (
    <Slider
      disabled={disabled}
      sx={{ width: "75%" }}
      value={percent}
      min={0}
      max={100}
      step={5}
      marks={[{ value: 50, label: "\u25B2" }]}
      valueLabelDisplay="auto"
      valueLabelFormat={(percent) => `${percent}%`}
      onChange={(_, newValue) =>
        newValue !== percent && (!preventZero || newValue !== 0)
          ? onChange(type_invariant(newValue, isNumber))
          : undefined
      }
    />
  );
}

const isNumber = (x: unknown): x is number => typeof x === "number";
