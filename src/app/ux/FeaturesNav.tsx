import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PeopleIcon from "@mui/icons-material/People";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { C, Dict, Vec } from "common";
import { useHistory, useLocation } from "react-router-dom";

interface Feature {
  label: string;
  url: string;
  icon: React.ReactNode;
}
const FEATURES: Readonly<Record<string, Readonly<Feature>>> = {
  games: { label: "Games", url: "/games", icon: <LibraryAddIcon /> },
  players: { label: "Players", url: "/players", icon: <PeopleIcon /> },
};

export function FeaturesNav(): JSX.Element {
  const location = useLocation();
  const history = useHistory();

  return (
    <BottomNavigation
      component="nav"
      showLabels
      value={C.first(
        Vec.keys(Dict.filter(FEATURES, ({ url }) => location.pathname === url))
      )}
      onChange={(_, newActive) => history.push(FEATURES[newActive].url)}
      sx={{ flexGrow: 0 }}
    >
      {Vec.map_with_key(FEATURES, (key, { label, icon }) => (
        <BottomNavigationAction
          key={key}
          value={key}
          label={label}
          icon={icon}
        />
      ))}
    </BottomNavigation>
  );
}
