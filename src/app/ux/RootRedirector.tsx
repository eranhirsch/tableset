import { useAppSelector } from "app/hooks";
import { gameSelector } from "features/game/gameSlice";
import { Redirect } from "react-router-dom";

export function RootRedirector(): JSX.Element {
  const game = useAppSelector(gameSelector);
  return <Redirect to={`/${game?.id ?? "games"}`} />;
}
