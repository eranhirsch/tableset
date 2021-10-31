import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
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
    </BottomNavigation>
  );
}
