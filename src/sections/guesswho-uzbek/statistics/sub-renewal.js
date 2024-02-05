// *********************************     TOTAL SUBSCRIBERS     ***************************************

import { Avatar, Card, CardContent, CircularProgress, Stack, SvgIcon, Typography } from "@mui/material";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { MdAutorenew } from "react-icons/md";

export const SubsRenewal = (props) => {
  // TAKING DATA AS PROPS
  const data = props.Data;
  const loading = props.loading;

  const { sx } = props;
  // const { difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}>
          <Stack spacing={1}>
            <Typography color="text.secondary"
              variant="overline">
              Total Renewal
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
            <Typography variant="h5">{parseInt(data).toLocaleString()}</Typography>
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
            <MdAutorenew size={27} />
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
