import PropTypes from "prop-types";
import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";

export const Growth = (props) => {
  // const { difference, positive = false, sx, value } = props;
  const data = Number((props.Data - props.Data1) / props.Data1) * 100;
  return (
    <Card>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography color="text.secondary" 
              variant="overline">
              MoM Growth
            </Typography>
            {props.loading || props.loading1 ? (
              <CircularProgress />
            ) : (
              <Typography variant="h5">{data.toFixed(2)} %</Typography>
            )}
          </Stack>
          {parseFloat(data) < 0 ? (
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
