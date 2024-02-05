// *********************************     TOTAL SUBSCRIBERS     ***************************************

import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";

export const Revenue = (props) => {
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
              Revenues
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Typography variant="h5">{parseInt(data.rev).toLocaleString()} SAR</Typography>
                <hr
                  style={{
                    border: "none",
                    borderBottom: "1px solid #ccc",
                    width: "100%",
                    margin: "0 0.5rem", // Add margin for spacing
                  }}
                />
                <Typography variant="h5">
                  {parseInt(data.revusd).toLocaleString("en-US")} $
                </Typography>
              </>
            )}
          </Stack>
          {/* USER ICON */}
          <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <CurrencyDollarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Revenue.prototypes = {
//   difference: PropTypes.number,
//   positive: PropTypes.bool,
//   sx: PropTypes.object,
//   value: PropTypes.string.isRequired
// };
