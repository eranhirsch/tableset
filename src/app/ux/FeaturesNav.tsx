import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import PeopleIcon from "@mui/icons-material/People";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { C, Dict, Vec } from "common";
import { hasActivePlayersSelector } from "features/players/playersSlice";
import { useHistory, useLocation } from "react-router-dom";

interface Feature {
  label: string;
  url: string;
  icons: { selected: React.ReactNode; unselected: React.ReactNode };
}
const FEATURES: Readonly<Record<string, Readonly<Feature>>> = {
  games: {
    label: "Games",
    url: "/games",
    icons: {
      selected: <LibraryAddIcon />,
      unselected: <LibraryAddOutlinedIcon />,
    },
  },
  players: {
    label: "Players",
    url: "/players",
    icons: { selected: <PeopleIcon />, unselected: <PlayersIcon /> },
  },
};

export function FeaturesNav(): JSX.Element {
  const location = useLocation();
  const history = useHistory();

  const value = C.first(
    Vec.keys(Dict.filter(FEATURES, ({ url }) => location.pathname === url))
  );
  return (
    <BottomNavigation
      component="nav"
      showLabels
      value={value}
      onChange={(_, newActive) => history.push(FEATURES[newActive].url)}
      sx={{ flexGrow: 0 }}
    >
      {Vec.map_with_key(FEATURES, (key, { label, icons }) => (
        <BottomNavigationAction
          key={key}
          value={key}
          label={label}
          icon={icons[value === key ? "selected" : "unselected"]}
        />
      ))}
    </BottomNavigation>
  );
}

function PlayersIcon(): JSX.Element {
  const hasActive = useAppSelector(hasActivePlayersSelector);
  return (
    <Badge variant="dot" color="warning" invisible={hasActive}>
      <PeopleOutlinedIcon />
    </Badge>
  );
}
