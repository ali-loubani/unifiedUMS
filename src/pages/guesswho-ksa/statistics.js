import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { Box, Container } from "@mui/system";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SubsCount } from "../../sections/guesswho-ksa/statistics/sub-count";
import { SubsRenewal } from "../../sections/guesswho-ksa/statistics/sub-renewal";
import { SubsCampaignMobile } from "../../sections/guesswho-ksa/statistics/sub-campaign-mobileArts";
import { UnSubs } from "../../sections/guesswho-ksa/statistics/unsubs";
import { Revenue } from "../../sections/guesswho-ksa/statistics/revenue";
import { Growth } from "../../sections/guesswho-ksa/statistics/growth";
import Cookies from "js-cookie";
import { BeatLoader, MoonLoader } from "react-spinners";
import { DateTime } from "luxon";

const Page = () => {
  const uzbekistanTime = DateTime.now().setZone('Asia/Tashkent');
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [operator, setOperator] = useState('0');
  const [dateFrom, setDateFrom] = useState(uzbekistanTime.toFormat('yyyy-MM-dd'));
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat('yyyy-MM-dd'));

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
    if (selectedDateTo <= uzbekistanTime.toFormat('yyyy-MM-dd')) {
      setDateTo(selectedDateTo); // MAKING SURE NO DATETO CHOOSEN GREATER THAN THE CURRENT DATE
    }
  };

  const checkToken = async () => {

    try {
      const response = await fetch('http://82.148.2.56:8088/api/checkToken', {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        }
      });
      const jsonData = await response.json();
      if (response.status == 401 || jsonData.username != Cookies.get('username') ) {
        window.location.href = '../auth/login'
      }
      else {
        setLoadingPage(false);
      }

    } catch (error) {
      console.log('Error');
    }
  }

  useEffect(() => {
    checkToken();
    fetchData();
    fetchData1();
  },[]);


  const fetchData = async () => {

    try {
      const response = await fetch(
        'http://guesswhoservice.com/api/statistics.php',
      );
      const jsonData = await response.json();
      setData(jsonData);

    } catch (error) {
      console.log("error fetching data: " + error);

    } finally {
      setLoading(false);
    }
  };

  const fetchData1 = async () => {
    try {
      const response = await fetch(
        'http://guesswhoservice.com/api/revenue.php'
      );
      const jsonData = await response.json();
      setData1(jsonData);

    } catch (error) {
      console.log("error fetching data: " + error);

    } finally {
      setLoading1(false);
    }
  };

  const handlefilter = () => {
    fetchDataDate();
    fetchDataDate1();
  };

  const fetchDataDate = async () => {
    setLoading(true);

    try {
      let response = null;
      if (operator == '0') {
        response = await fetch(
          'http://guesswhoservice.com/api/statistics.php?from=' + dateFrom + '&to=' + dateTo
          );
        }
        else {
          response = await fetch(
        'http://guesswhoservice.com/api/statistics.php?from=' + dateFrom + '&to=' + dateTo + "&operator=" + operator
        );
        }

      const jsonData = await response.json();
      setData(jsonData);

    } catch (error) {
      console.log("error fetching data: " + error);

    } finally {
      setLoading(false);
    }
  }
  const fetchDataDate1 = async () => {
    setLoading1(true);

    try {
      let response = null;
      if (operator == '0') {
        response = await fetch(
          'http://guesswhoservice.com/api/revenue.php?from=' + dateFrom + '&to=' + dateTo
          );
        }
        else {
          response = await fetch(
        'http://guesswhoservice.com/api/revenue.php?from=' + dateFrom + '&to=' + dateTo + "&operator=" + operator
        );
        }
      const jsonData = await response.json();
      setData1(jsonData);

    } catch (error) {
      console.log("error fetching data: " + error);

    } finally {
      setLoading1(false);
    }
  }

  return (
    <>
    {loadingPage ? (
      <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <MoonLoader color="blue" />
    </div>
    ) : (
      <>
         <Head>
        <title>Statistics | Guess Who</title>
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
          spacing={1}
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
                  max: uzbekistanTime.toFormat('yyyy-MM-dd'),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item>

                 <Select variant="outlined"
                  value={operator}
                  onChange={(e) => {setOperator(e.target.value)}}>
                    <MenuItem value="0">All</MenuItem>
                    <MenuItem value="1">Mobily</MenuItem>
                    <MenuItem value="2">Zain</MenuItem>
                    <MenuItem value="3">STC</MenuItem>
                  </Select>
                </Grid>
            <Grid item>
            <Button onClick={handlefilter}
            style={{ backgroundColor: "#75E6DA", color: "#000" }}
            disabled={loading || (loading && loading1)}>
            {loading || loading || loading1 ? (
                      <BeatLoader />
                    ) : (
                      "Search"
                    )}
            </Button>
            </Grid>
            <Grid container
              spacing={2} >
                <Grid item
                  xs={12}
                  sm={6}
                  lg={4}>
                    <SubsCount Data={data.subsCount}
                      loading={loading} />
                </Grid>

                <Grid item
                  xs={12}
                  sm={6}
                  lg={4}>
                    <SubsCampaignMobile Data={data.subscampaign9}
                      loading={loading} />
                </Grid>
                <Grid item
                  xs={12}
                  sm={6}
                  lg={4}>
                    <SubsRenewal Data={data.subrenewal}
                      loading={loading} />
                </Grid>
                <Grid item
                  xs={12}
                  sm={6}
                  lg={4}>
                    <UnSubs Data={data.unSubsCount}
                      loading={loading} />
                </Grid>
                <Grid item
                  xs={12}
                  sm={6}
                  lg={4}>
                    <Revenue Data={data1}
                      loading={loading1} />
                </Grid>
                <Grid item
                  xs={12}
                  sm={6}
                  lg={4}>
                    <Growth Data={data1}
                      loading={loading1} />
                </Grid>
              </Grid>
          </Grid>
        </Container>
      </Box>
      </>
    )}

    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
