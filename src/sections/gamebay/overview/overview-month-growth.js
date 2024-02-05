// *****************************      TOTAL DEACTIVES      **********************************

import PropTypes from "prop-types";
import { Avatar, Card, CardContent, CircularProgress, Stack, SvgIcon, Typography } from "@mui/material";
import {BsGraphDownArrow, BsGraphUpArrow} from 'react-icons/bs'

export const OverviewMonthGrowth = (props) => {
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
              MoM Growth
            </Typography>
            {props.loading ? (
              <CircularProgress />
            ) : (
            <Typography variant="h4">{data} %</Typography>
            )}
          </Stack>
          {parseInt(data) < 0 ? (
            <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <BsGraphDownArrow />
            </SvgIcon>
          </Avatar>
          ) : (
             <Avatar
            sx={{
              backgroundColor: "success.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <BsGraphUpArrow />
            </SvgIcon>
          </Avatar>
          )}

        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewMonthGrowth.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
