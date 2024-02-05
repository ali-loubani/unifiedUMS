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
  import Cookies from "js-cookie";
  
  export const SubscriberStat = ( props ) => {
    const user = Cookies.get("username");
    const  data  = props.data;
    const  loading  = props.loading;
    const  operatorCount  = props.operatorCount;
  
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
                    <Typography variant="h4">{data.length}</Typography>
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
        {Object.entries(operatorCount).map(([operatorName, operatorValue]) => (
            <Grid item
            key={operatorName}>
              <Card>
                <CardContent>
  
                    <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Stack spacing={1}>
                        {/* OPERATOR NAME */}
                        <Typography color="text.secondary"
                        variant="overline">
                          {operatorName} Operator
                        </Typography>
                        {/* SUBSCRIBERS NUMBER VIA OPERATOR */}
                        {loading ? (
                    // NO DATA => CIRCULAR PROGRESS
                    <CircularProgress />
                  ) : (
                        <Typography variant="h4">{operatorValue}</Typography>
                  )}
                      </Stack>
                      {/* ICON */}
                      <Avatar
                        sx={{
                          backgroundColor: "error.main",
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
          ))}
      </Grid>
    );
  };
  