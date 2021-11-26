import {
  Checkbox,
  Divider,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { $, C, Dict, Num, Shape, Vec } from "common";
import { useMemo } from "react";
import UAParser from "ua-parser-js";

interface SpecialItem {
  label: string;
  itemizer<ItemId extends string | number>(
    available: readonly ItemId[]
  ): readonly ItemId[];
}
const SPECIAL_ITEMS = {
  __all: { label: "Select All", itemizer: (_) => [] } as SpecialItem,
  __none: { label: "Clear", itemizer: (available) => available } as SpecialItem,
} as const;

export function SingleItemSelect<ItemId extends string | number>({
  items,
  onChange,
  labelForId,
}: {
  items: Readonly<Record<ItemId, boolean>>;
  onChange(unselected: readonly ItemId[]): void;
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  const isMobile = useMemo(
    () => UAParser().device.type === UAParser.DEVICE.MOBILE,
    []
  );

  const allItemIds = useMemo(() => Vec.keys(items), [items]);
  const unselectedItemIds = useMemo(
    () => Vec.keys(Dict.filter(items, (isSelected) => !isSelected)),
    [items]
  );

  return (
    <FormControl
      fullWidth
      color={
        unselectedItemIds.length === allItemIds.length ? "error" : undefined
      }
    >
      {isMobile ? (
        <MobileSelect
          all={allItemIds}
          unselected={unselectedItemIds}
          labelForId={labelForId}
          onChange={onChange}
        />
      ) : (
        <RichSelect
          all={allItemIds}
          unselected={unselectedItemIds}
          labelForId={labelForId}
          onChange={onChange}
        />
      )}
    </FormControl>
  );
}

function RichSelect<ItemId extends string | number>({
  all,
  unselected,
  labelForId,
  onChange,
}: {
  all: readonly ItemId[];
  unselected: readonly ItemId[];
  labelForId(itemId: ItemId): string;
  onChange(unselected: readonly ItemId[]): void;
}): JSX.Element {
  const selected: readonly (ItemId | keyof typeof SPECIAL_ITEMS)[] = useMemo(
    () => Vec.diff(all, unselected),
    [all, unselected]
  );

  return (
    <Select
      multiple
      displayEmpty
      value={selected}
      renderValue={() =>
        `${unselected.length === all.length ? "Error: " : ""}${
          all.length - unselected.length
        } Selected`
      }
      onChange={({ target: { value } }) => {
        if (typeof value !== "string") {
          const special = C.only(
            Vec.values(
              Shape.filter_with_keys(SPECIAL_ITEMS, (itemId) =>
                value.includes(itemId)
              )
            )
          );
          onChange(special?.itemizer(all) ?? Vec.diff(all, value));
        }
      }}
    >
      {Vec.map_with_key(SPECIAL_ITEMS, (itemId, { label, itemizer }) => (
        <MenuItem
          key={itemId}
          value={itemId}
          disabled={Vec.equal(itemizer(all), unselected)}
        >
          <em>{label}</em>
        </MenuItem>
      ))}
      <Divider />
      {Vec.map(all, (key) => (
        <MenuItem key={key} value={key}>
          <Checkbox checked={!unselected.includes(key)} />
          {labelForId(key)}
        </MenuItem>
      ))}
    </Select>
  );
}

function MobileSelect<ItemId extends string | number>({
  all,
  unselected,
  onChange,
  labelForId,
}: {
  all: readonly ItemId[];
  unselected: readonly ItemId[];
  onChange(unselected: readonly ItemId[]): void;
  labelForId(itemId: ItemId): string;
}): JSX.Element {
  const selected = useMemo(() => Vec.diff(all, unselected), [all, unselected]);

  return (
    <select
      multiple
      value={selected as readonly string[]}
      onChange={(event) =>
        $(
          [...event.target.options],
          ($$) =>
            Vec.maybe_map($$, ({ value, selected }) =>
              selected ? Num.int(value) ?? value : undefined
            ),
          ($$) => Vec.diff(all, $$),
          onChange
        )
      }
    >
      {Vec.map(all, (itemId) => (
        <option key={itemId} value={itemId}>
          {labelForId(itemId)}
        </option>
      ))}
    </select>
  );
}
