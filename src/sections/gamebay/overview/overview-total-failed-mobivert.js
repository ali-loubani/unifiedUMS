
import PropTypes from "prop-types";
import { Avatar, Card, CardContent, CircularProgress, Stack, SvgIcon, Typography } from "@mui/material";
import { FaThumbsDown } from "react-icons/fa";

export const OverviewTotalFailedMobivert = (props) => {
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
              Total Failed by Mobivert
            </Typography>
            {props.loading ? (
                <CircularProgress />
              ) : (
            <Typography variant="h4">{data}</Typography>
              )}

          </Stack>
          <Avatar
            sx={{
              backgroundColor: "error.main",
              height: 56,
              width: 56,
            }}
          >
            <SvgIcon>
              <FaThumbsDown />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalFailedMobivert.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};
