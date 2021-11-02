import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function Megaphone({
  header,
  body,
  cta,
}: {
  header: string;
  body: React.ReactNode;
  cta?: { label: string; url: string };
}): JSX.Element {
  return (
    <Paper sx={{ paddingY: 2, paddingX: 3, marginBottom: 1 }}>
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">{header}</Typography>
        <Typography variant="body2">{body}</Typography>
        {cta != null && (
          <Button
            sx={{ width: "50%", alignSelf: "end" }}
            size="small"
            component={Link}
            to={cta.url}
          >
            {cta.label}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
