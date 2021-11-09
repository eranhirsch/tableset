import AppsIcon from "@mui/icons-material/Apps";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import PeopleIcon from "@mui/icons-material/People";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Badge, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useAppSelector } from "app/hooks";
import { C, Dict, Vec } from "common";
import { hasActivePlayersSelector } from "features/players/playersSlice";
import { useLocation, useNavigate } from "react-router-dom";

interface Feature {
  label: string;
  url: string;
  icons: { selected: React.ReactNode; unselected: React.ReactNode };
}
const FEATURES: Readonly<Record<string, Readonly<Feature>>> = {
  collection: {
    label: "Collection",
    url: "collection",
    icons: {
      selected: <LibraryAddIcon />,
      unselected: <LibraryAddOutlinedIcon />,
    },
  },
  games: {
    label: "Games",
    url: "",
    icons: {
      selected: <AppsIcon />,
      unselected: <AppsOutlinedIcon />,
    },
  },
  players: {
    label: "Players",
    url: "players",
    icons: { selected: <PeopleIcon />, unselected: <PlayersIcon /> },
  },
};

export function FeaturesNav(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const value = C.first(
    Vec.keys(
      Dict.filter(FEATURES, ({ url }) => location.pathname.endsWith("/" + url))
    )
  );
  return (
    <BottomNavigation
      component="nav"
      showLabels
      value={value}
      onChange={(_, newActive) => navigate(FEATURES[newActive].url)}
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
