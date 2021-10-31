import { useAppSelector } from "app/hooks";
import { gameSelector } from "features/game/gameSlice";
import { playersSelectors } from "features/players/playersSlice";
import { Redirect } from "react-router-dom";

export function RootRedirector(): JSX.Element {
  const game = useAppSelector(gameSelector);
  const playersCount = useAppSelector(playersSelectors.selectTotal);

  return (
    <Redirect
      to={
        playersCount === 0
          ? "/players"
          : game == null
          ? "/games"
          : `/${game.id}`
      }
    />
  );
}
