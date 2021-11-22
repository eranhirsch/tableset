import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { TSPage } from "app/ux/Chrome";
import { Vec } from "common";
import { useNavigate } from "react-router-dom";
import { CloseButton } from "./CloseButton";
import { useInstanceActiveSteps } from "./useInstanceActiveSteps";

export const TABLE_OF_CONTENTS_PATH = "ToC";

export function TableOfContents(): JSX.Element {
  const navigate = useNavigate();
  const activeSteps = useInstanceActiveSteps();
  return (
    <TSPage>
      <Box display="flex" flexDirection="column" flexGrow={1} height="100%">
        <CloseButton />
        <Typography variant="h4" paddingY={3} color="primary">
          Overview
        </Typography>
        <List dense>
          {Vec.map(activeSteps, (step, index) => (
            <ListItem disableGutters>
              <ListItemButton onClick={() => navigate(`/instance/${step.id}`)}>
                <ListItemText>
                  {index + 1}. {step.label}
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </TSPage>
  );
}
