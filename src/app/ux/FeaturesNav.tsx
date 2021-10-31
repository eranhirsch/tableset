import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";

export function FeaturesNav(): JSX.Element {
  return (
    <BottomNavigation component="nav" showLabels value={0} sx={{ flexGrow: 0 }}>
      <BottomNavigationAction label="Games" icon={<LibraryAddIcon />} />
    </BottomNavigation>
  );
}
