import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PeopleIcon from "@mui/icons-material/People";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Link } from "react-router-dom";

export function FeaturesNav(): JSX.Element {
  return (
    <BottomNavigation component="nav" showLabels value={0} sx={{ flexGrow: 0 }}>
      <BottomNavigationAction
        component={Link}
        label="Games"
        icon={<LibraryAddIcon />}
        to="/games"
      />
      <BottomNavigationAction
        component={Link}
        label="Players"
        icon={<PeopleIcon />}
        to="/players"
      />
    </BottomNavigation>
  );
}
