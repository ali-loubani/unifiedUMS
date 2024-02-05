// *********************************     TOTAL SUBSCRIBERS     ***************************************

import { Avatar, Card, CardContent, CircularProgress, Stack, SvgIcon, Typography } from "@mui/material";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";

export const OverviewTotalSubscribers = (props) => {
  // TAKING DATA AS PROPS
  const data = props.Data;

  const { sx } = props;
  // const { difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start"
          direction="row"
          justifyContent="space-around"
          spacing={3}>

          <Stack spacing={1}>
            <Typography color="text.secondary"
              variant="overline">
              Total Subs &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 
            </Typography>
            {props.loading ? (
              <CircularProgress />
            ) : (
            <Typography variant="h4">{data}</Typography>
            )}
          </Stack>
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

        {/* {difference && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              Since last month
            </Typography>
          </Stack>
        )} */}
      </CardContent>
    </Card>
  );
};

// OverviewTotalSubscribers.prototypes = {
//   difference: PropTypes.number,
//   positive: PropTypes.bool,
//   sx: PropTypes.object,
//   value: PropTypes.string.isRequired
// };
