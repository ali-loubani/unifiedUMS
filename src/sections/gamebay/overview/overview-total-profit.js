// *****************************      TOTAL PROFITS      **********************************

import PropTypes from "prop-types";
import CurrencyDollarIcon from "@heroicons/react/24/solid/CurrencyDollarIcon";
import { Avatar, Card, CardContent, CircularProgress, Stack, SvgIcon, Typography } from "@mui/material";

export const OverviewTotalProfit = (props) => {
  const data = props.Data; // SAVING THE DATA ACCESSED BY PROPS.
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
              Total Profit
            </Typography>
            {props.loading ? (
                <CircularProgress />
              ) : (
            <Typography variant="h5">{parseInt(data).toLocaleString("en-US")} UZS</Typography>
              )}
            <hr
              style={{
                border: "none",
                borderBottom: "1px solid #ccc",
                width: "100%",
                margin: "0 0.5rem", // Add margin for spacing
              }}
            />
            {props.loading ? (
                <CircularProgress />
              ) : (
            <Typography variant="h5">
              {(data * 0.000085).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
              )}
          </Stack>

          <Avatar
            sx={{
              backgroundColor: "primary.main",
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

OverviewTotalProfit.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
