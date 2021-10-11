import CasinoIcon from "@mui/icons-material/Casino";
import PanToolIcon from "@mui/icons-material/PanTool";
import PushPinIcon from "@mui/icons-material/PushPin";
import { Strategy } from "features/template/Strategy";

export function StrategyIcon({
  strategy,
}: {
  strategy: Strategy;
}): JSX.Element | null {
  switch (strategy) {
    case Strategy.FIXED:
      return <PushPinIcon />;
    case Strategy.RANDOM:
      return <CasinoIcon />;
    case Strategy.OFF:
      return <PanToolIcon />;
  }
}
