// // *********************************     SUBSCRIBERS STAT     ***************************************

import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";

export const SubscriberStat = ( props ) => {
  const  loading  = props.loading;
  const  total  = props.total;

  return (
    <Grid container
    spacing={2}>
    <Grid item>
        <Card >
          <CardContent>
              <Stack direction="row"
              justifyContent="space-between"
              spacing={3}>
                <Stack spacing={1}>
                  <Typography color="text.secondary"
                  variant="overline">
                    Total Subscribers
                  </Typography>
                  {/* TOTAL SUBSCRIBERS */}
                  {loading ? (
                  <CircularProgress />
                 ) : (
                  <Typography variant="h4">{parseInt(total).toLocaleString("en-US")} </Typography>
                  )}
                </Stack>
                {/* ICON */}
                <Avatar
                  sx={{
                    backgroundColor: "success.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <SvgIcon>
                    <UsersIcon />
                  </SvgIcon>
                </Avatar>
              </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
