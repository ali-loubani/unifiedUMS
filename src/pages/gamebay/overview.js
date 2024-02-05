// *********************************    OVERVIEW    ************************************

import {
  Box,
  Button,
  Container,
  Unstable_Grid2 as Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BeatLoader, MoonLoader } from "react-spinners";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewSales } from "src/sections/gamebay/overview/overview-sales";
import { OverviewTotalProfit } from "src/sections/gamebay/overview/overview-total-profit";
import { OverviewTotalSubscribers } from "src/sections/gamebay/overview/overview-total-subscribers";
import { OverviewTotalUnsubscribedSubscribers } from "src/sections/gamebay/overview/overview-total-unsubscribed-subscribers";
import { OverviewMonthGrowth } from "../../sections/gamebay/overview/overview-month-growth";
import { OverviewSubType } from "../../sections/gamebay/overview/overview-sub-type";
import { OverviewTotalDeactives } from "../../sections/gamebay/overview/overview-total-deactives";
import { OverviewTotalFailedMobivert } from "../../sections/gamebay/overview/overview-total-failed-mobivert";
import { OverviewTotalRegisters } from "../../sections/gamebay/overview/overview-total-registers";
import { OverviewTotalRenewal } from "../../sections/gamebay/overview/overview-total-renewal";
import { OverviewTotalMobivert } from "../../sections/gamebay/overview/overview-total-subs-mobivert";
import { OverviewTotalUnknowns } from "../../sections/gamebay/overview/overview-total-unknowns";
import { OverviewTotalUnsuccessful } from "../../sections/gamebay/overview/overview-total-unsuccessful";
import { OverviewTotalLanding } from "../../sections/gamebay/overview/overview-total-Landing";

const Page = () => {
  const uzbekistanTime = DateTime.now().setZone("Asia/Tashkent");
  const [data, setData] = useState([]);
  const [operator, setOperator] = useState("0");
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  // const [statistics, setStatistics] = useState([]);
  // const [lastStatistics, setLastStatistics] = useState([]);

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
    fetchData(Cookies.get("usertoken"));
    // fetchStatisticsForMonth(2023);
    // fetchStatisticsForMonth(2022);
  }, []);

  useEffect(() => {
    checkToken();
  }, [operator, dateFrom, dateTo]);

  const checkToken = async () => {
    try {
      const response = await fetch("http://82.148.2.56:8088/api/checkToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });
      const jsonData = await response.json();
      if (response.status == 401 || jsonData.username != Cookies.get("username")) {
        window.location.href = "../auth/login";
      } else {
        setLoadingPage(false);
      }
    } catch (error) {
      console.log("Error");
    }
  };

  const labels = ["SMS", "ForceLanding", "LandingPage", "Web", "System"];
  const series = [
    parseInt(data.new_subs_sms),
    parseInt(data.new_subs_force),
    parseInt(data.new_subs_landing),
    parseInt(data.new_subs_web),
    parseInt(data.new_subs_system),
  ];

  // TAKING DATEFROM AND SAVING IT IN A USESTATE
  const handleDateFromChange = (event) => {
    const selectedDateFrom = event.target.value;
    setDateFrom(selectedDateFrom);
    if (selectedDateFrom > dateTo) {
      setDateTo(selectedDateFrom); // MAKING SURE NO DATEFROM CHOOSEN GREATER THAN DATETO
    }
  };

  // TAKING DATETO AND SAVING IT IN A USESTATE
  const handleDateToChange = (event) => {
    const selectedDateTo = event.target.value;
    if (selectedDateTo <= uzbekistanTime.toFormat("yyyy-MM-dd")) {
      setDateTo(selectedDateTo); // MAKING SURE NO DATETO CHOOSEN GREATER THAN THE CURRENT DATE
    }
  };

  // GET STATISTICS API
  const fetchDataDate = async (token) => {
    setLoading(true);
    try {
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.2.56:8088/api/statistics?from=" + dateFrom + "&to=" + dateTo,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
      } else {
        response = await fetch(
          "http://82.148.2.56:8088/api/statistics?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
      }

      const jsonData = await response.json();
      setData(jsonData); // SAVING STATISTICS IN DATA USE STATE
      if (jsonData.message === "Unauthenticated.") {
        redirectToLogin();
      }
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (token) => {
    try {
      const response = await fetch("http://82.148.2.56:8088/api/statistics", {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
      if (jsonData.message === "Unauthenticated.") {
        redirectToLogin();
      }
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoading(false);
    }
  };

  // async function fetchStatisticsForMonth(year) {
  //   const stat = [];

  //   for (let month = 1; month <= 12; month++) {
  //     const url = `http://82.148.2.56:8088/api/statistics?from=${year}-${month}-01&to=${year}-${month}-31`;

  //     try {
  //       const response = await fetch(url, {
  //         headers: {
  //           Authorization: `Bearer ${Cookies.get("usertoken")}`,
  //         },
  //       });
  //       const data = await response.json();
  //       stat.push({
  //         data: data.total_Revenue,
  //       });
  //     } catch (error) {
  //       console.error(`Error fetching data`, error);
  //     }
  //   }
  //    if (year == 2023) setStatistics(stat);
  //    if (year == 2022) setLastStatistics(stat);
  // }

  const redirectToLogin = () => {
    window.location.href = "../auth/login";
  };

  // CALLING FETCH DATA WITH DATE PARAMS
  const handlefilter = () => {
    fetchDataDate(Cookies.get("usertoken"));
  };

  return (
    <>
      {loadingPage ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <MoonLoader color="blue" />
        </div>
      ) : (
        <>
          <Head>
            <title>Overview | Game Bay</title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            <Container maxWidth="xl">
              <Grid container 
                spacing={2} 
                justifyContent="center" 
                alignItems="center">
                <Grid item 
                  xs={12} 
                  sm={3}>
                  <TextField
                    label="From Date"
                    type="date"
                    value={dateFrom}
                    onChange={handleDateFromChange}
                    fullWidth
                    inputProps={{
                      max: dateTo,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  sm={3}>
                  <TextField
                    label="To Date"
                    type="date"
                    value={dateTo}
                    onChange={handleDateToChange}
                    fullWidth
                    inputProps={{
                      min: dateFrom,
                      max: uzbekistanTime.toFormat("yyyy-MM-dd"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item>
                  <Select
                    variant="outlined"
                    value={operator}
                    onChange={(e) => {
                      setOperator(e.target.value);
                    }}
                  >
                    <MenuItem value="0">All</MenuItem>
                    <MenuItem value="1">Uzmobile</MenuItem>
                    <MenuItem value="2">Ucell</MenuItem>
                  </Select>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handlefilter}
                    style={{ backgroundColor: "#75E6DA", color: "#000" }}
                    disabled={loading}
                  >
                    {loading ? <BeatLoader /> : "Search"}
                  </Button>
                </Grid>
              </Grid>
              <Grid container 
                spacing={2}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalSubscribers // CALLING OVERVIEW-TOTAL-SUBS FILE
                    // difference={12}
                    sx={{ height: "100%" }}
                    Data={data.new_subs_total} // SAVING TOTAL SUBS IN DATA PROPS
                    loading={loading}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalRenewal // CALLING OVERVIEW-TOTAL-RENEWAL FILE
                    // difference={16}
                    Data={data.renewals} // SAVING TOTAL SUBS IN DATA PROPS
                    loading={loading}
                    positive={false}
                    sx={{ height: "100%" }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalMobivert
                    // difference={16}
                    Data={data.new_subs_mobivert}
                    loading={loading}
                    positive={false}
                    sx={{ height: "100%" }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalFailedMobivert
                    // difference={16}
                    Data={data.fail_subs_mobivert}
                    loading={loading}
                    positive={false}
                    sx={{ height: "100%" }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalLanding
                    // difference={16}
                    Data={data.new_subs_google}
                    loading={loading}
                    positive={false}
                    sx={{ height: "100%" }}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalUnsubscribedSubscribers // CALLING OVERVIEW-TOTAL-UNSUBS FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.unsubs} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                >
                  <OverviewTotalProfit // CALLING OVERVIEW-TOTAL-PROFITS FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.total_Revenue} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  sm={6} 
                  lg={4}>
                  <OverviewTotalDeactives // CALLING OVERVIEW-TOTAL-DEACTIVES FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.deactives} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  sm={6} 
                  lg={4}>
                  <OverviewTotalRegisters // CALLING OVERVIEW-TOTAL-REGISTERS FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.registers} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  sm={6} 
                  lg={4}>
                  <OverviewTotalUnsuccessful // CALLING OVERVIEW-TOTAL-UNSUCCESS FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.unsuccessful} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  sm={6} 
                  lg={4}>
                  <OverviewTotalUnknowns // CALLING OVERVIEW-TOTAL-UNKNOWNS FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.unkonws} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>

                <Grid item 
                  xs={12} 
                  sm={6} 
                  lg={4}>
                  <OverviewMonthGrowth // CALLING OVERVIEW-TOTAL-UNSUBS FILE
                    sx={{ height: "100%" }}
                    loading={loading}
                    Data={data.Month_over_month_growth} // SAVING TOTAL SUBS IN DATA PROPS
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  md={7}>
                  <OverviewSales
                    chartSeries={[
                      {
                        name: "This Year",
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                      },
                      {
                        name: "Last Year",
                        data: [4, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15],
                      },
                    ]}
                    sx={{ height: "100%" }}
                    loading={loading}
                  />
                </Grid>
                <Grid item 
                  xs={12} 
                  md={5}>
                  <OverviewSubType // CALLING OVERVIEW-SUB-TYPE FILE
                    // PASSING DATA TO THE FILE VIA PROPS
                    series={series}
                    labels={labels}
                    loading={loading}
                    sx={{ height: "100%" }}
                  />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

// CALLING THE DASHBOARD LAYOUT (SIDEBAR)
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
