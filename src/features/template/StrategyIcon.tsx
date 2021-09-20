import CasinoIcon from "@mui/icons-material/Casino";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PanToolIcon from "@mui/icons-material/PanTool";
import PushPinIcon from "@mui/icons-material/PushPin";
import QuizIcon from "@mui/icons-material/Quiz";
import { Strategy } from "features/template/Strategy";

export default function StrategyIcon({
  strategy,
}: {
  strategy: Strategy;
}): JSX.Element | null {
  switch (strategy) {
    case Strategy.FIXED:
      return <PushPinIcon />;
    case Strategy.ASK:
      return <QuizIcon />;
    case Strategy.RANDOM:
      return <CasinoIcon />;
    case Strategy.OFF:
      return <PanToolIcon />;
    case Strategy.DEFAULT:
      return <FlashOnIcon />;
  }
}
