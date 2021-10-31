import { useAppSelector } from "app/hooks";
import { isGameSelectedSelector } from "features/game/gameSlice";
import { playersSelectors } from "features/players/playersSlice";
import { Redirect } from "react-router-dom";
export function RootRedirector(): JSX.Element {
  const isGame = useAppSelector(isGameSelectedSelector);
  const playersCount = useAppSelector(playersSelectors.selectTotal);

  return (
    <Redirect
      to={playersCount === 0 ? "/players" : !isGame ? "/games" : "/template"}
    />
  );
}
