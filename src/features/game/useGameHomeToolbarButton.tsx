import HomeIcon from "@mui/icons-material/Home";
import { useAppSelector } from "app/hooks";
import { ToolbarButton } from "app/ux/Chrome";
import { nullthrows } from "common";
import { gameIdSelector } from "./gameSlice";

export function useGameHomeToolbarButton(): ToolbarButton {
  const gameId = nullthrows(
    useAppSelector(gameIdSelector),
    `GameHomeToolbarButton can't be used without a selected game`
  );
  return [<HomeIcon />, `/${gameId}`];
}
