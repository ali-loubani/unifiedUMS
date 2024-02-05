import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { Box, Container } from "@mui/system";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BeatLoader, MoonLoader } from "react-spinners";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { Growth } from "../../sections/guesswho-uzbek/statistics/growth";
import { Revenue } from "../../sections/guesswho-uzbek/statistics/revenue";
import { ShortCode } from "../../sections/guesswho-uzbek/statistics/short-code";
import { SubsCampaignHen } from "../../sections/guesswho-uzbek/statistics/sub-campaign-Hendrick";
import { SubsCampaignLanding } from "../../sections/guesswho-uzbek/statistics/sub-campaign-Landing";
import { SubsCampaignMobivert } from "../../sections/guesswho-uzbek/statistics/sub-campaign-Mobivert";
import { SubsCampaignS1 } from "../../sections/guesswho-uzbek/statistics/sub-campaign-S1";
import { SubsCampaignMobile } from "../../sections/guesswho-uzbek/statistics/sub-campaign-mobileArts";
import { SubsCount } from "../../sections/guesswho-uzbek/statistics/sub-count";
import { SubsLanding } from "../../sections/guesswho-uzbek/statistics/sub-landing";
import { SubsRenewal } from "../../sections/guesswho-uzbek/statistics/sub-renewal";
import { SubsSms } from "../../sections/guesswho-uzbek/statistics/sub-sms";
import { UnSubs } from "../../sections/guesswho-uzbek/statistics/unsubs";
import { SubsCampaignLanding2 } from "../../sections/guesswho-uzbek/statistics/sub-campaign-Landing2";

const Page = () => {
  const uzbekistanTime = DateTime.now().setZone("Asia/Tashkent");
  const [operator, setOperator] = useState("0");
  const [dateFrom, setDateFrom] = useState(
    uzbekistanTime.toFormat("yyyy-MM-dd")
  );
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));

  const [loadingPage, setLoadingPage] = useState(true);

  const [loadings, setLoadings] = useState({
    totalsubs: true,
    totalUnsubs: true,
    totalSubsLandingPage: true,
    totalSubS1: true,
    totalSubsHendrick: true,
    totalSubsMobivert: true,
    totalSubsMobileArts: true,
    totalSubsGoogle: true,
    totalSubsGoogle2: true,
    totalSubSms: true,
    shortCode: true,
    totalRevenue: false,
    totalRenewals: false,
    thisMonth: false,
    lastMonth: false,
    rate: false,
  });
  const [DATA, setDATA] = useState({
    totalsubs: 0,
    totalUnsubs: 0,
    totalSubsLandingPage: 0,
    totalSubS1: 0,
    totalSubsHendrick: 0,
    totalSubsMobivert: 0,
    totalSubsMobileArts: 0,
    totalSubsGoogle: 0,
    totalSubsGoogle2: 0,
    totalSubSms: 0,
    shortCode: 0,
    totalRevenue: 0,
    totalRenewals: 0,
    thisMonth: 0,
    lastMonth: 0,
    rate: 0,
  });

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
      if (
        response.status == 401 ||
        jsonData.username != Cookies.get("username")
      ) {
        window.location.href = "../auth/login";
      } else {
        setLoadingPage(false);
      }
    } catch (error) {
      console.log("Error" + error);
    }
  };

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

  useEffect(() => {
    checkToken();
    Totalsubs();
    TotalSubS1();
    TotalSubsGoogle();
    TotalSubsGoogle2();
    TotalSubsHendrick();
    TotalSubsLandingPage();
    TotalSubsMobileArts();
    TotalSubsMobivert();
    TotalUnsubs();
    TotalsubsSMS();
    shortCode();
    ThisMonth();
    LastMonth();
    TotalRevenue();
    TotalRenewals();
    getRate();
  }, []);

  const Totalsubs = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalsubs: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubs?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubs?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalsubs: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalsubs: false,
      }));
    }
  };

  const TotalsubsSMS = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubSms: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubSms?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubSms?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubSms: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubSms: false,
      }));
    }
  };

  const TotalSubS1 = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubS1: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubS1?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubS1?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubS1: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubS1: false,
      }));
    }
  };

  const TotalSubsHendrick = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsHendrick: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsHendrick?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsHendrick?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubsHendrick: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsHendrick: false,
      }));
    }
  };

  const TotalSubsMobivert = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsMobivert: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsMobivert?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsMobivert?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubsMobivert: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsMobivert: false,
      }));
    }
  };

  const TotalSubsMobileArts = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsMobileArts: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsMobileArts?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsMobileArts?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubsMobileArts: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsMobileArts: false,
      }));
    }
  };

  const TotalSubsGoogle = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsGoogle: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsGoogle?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsGoogle?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubsGoogle: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsGoogle: false,
      }));
    }
  };

  const TotalSubsGoogle2 = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsGoogle2: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsGoogle2?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsGoogle2?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubsGoogle2: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsGoogle2: false,
      }));
    }
  };

  const TotalRevenue = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalRevenue: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalRevenue?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalRevenue?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalRevenue: jsonData.total_charge,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalRevenue: false,
      }));
    }
  };

  const getRate = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalRevenue: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/getRate?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/getRate?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        rate: jsonData.rate,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        rate: false,
      }));
    }
  };

  const TotalRenewals = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalRenewals: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalRenewals?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalRenewals?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalRenewals: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalRenewals: false,
      }));
    }
  };

  const ThisMonth = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        thisMonth: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/getSubsCountThisMonth?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/getSubsCountThisMonth?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        thisMonth: jsonData.chargeThisMonth,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        thisMonth: false,
      }));
    }
  };

  const LastMonth = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        lastMonth: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/getSubsCountLastMonth?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/getSubsCountLastMonth?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        lastMonth: jsonData.chargeLastMonth,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        lastMonth: false,
      }));
    }
  };

  const TotalUnsubs = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalUnsubs: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalUnsubs?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalUnsubs?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalUnsubs: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalUnsubs: false,
      }));
    }
  };

  const TotalSubsLandingPage = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsLandingPage: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsLandingPage?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/totalSubsLandingPage?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        totalSubsLandingPage: jsonData.count,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        totalSubsLandingPage: false,
      }));
    }
  };

  const shortCode = async () => {
    try {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        shortCode: true,
      }));
      let response = null;
      if (operator == "0") {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/shortCode?from=" +
            dateFrom +
            "&to=" +
            dateTo
        );
      } else {
        response = await fetch(
          "http://82.148.6.228:3000/statistics/shortCode?from=" +
            dateFrom +
            "&to=" +
            dateTo +
            "&operator=" +
            operator
        );
      }

      const jsonData = await response.json();
      setDATA((prevData) => ({
        ...prevData,
        shortCode: jsonData.results,
      }));
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoadings((prevLoading) => ({
        ...prevLoading,
        shortCode: false,
      }));
    }
  };

  const handlefilter = () => {
    Totalsubs();
    TotalSubS1();
    TotalSubsGoogle();
    TotalSubsGoogle2();
    TotalSubsHendrick();
    TotalSubsLandingPage();
    TotalSubsMobileArts();
    TotalSubsMobivert();
    TotalUnsubs();
    TotalsubsSMS();
    shortCode();
    ThisMonth();
    LastMonth();
    TotalRevenue();
    TotalRenewals();
    getRate();
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
              <Grid
                container
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                <Grid item xs={12} sm={3}>
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
                <Grid item xs={12} sm={3}>
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
                    <MenuItem value="2">Ums</MenuItem>
                  </Select>
                </Grid>
                <Grid item>
                  <Button
                    onClick={handlefilter}
                    style={{ backgroundColor: "#75E6DA", color: "#000" }}
                    disabled={Object.values(loadings).some(
                      (value) => value == true
                    )}
                  >
                    {Object.values(loadings).some((value) => value == true) ? (
                      <BeatLoader />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCount
                      Data={DATA.totalsubs}
                      loading={loadings.totalsubs}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCampaignS1
                      Data={DATA.totalSubS1}
                      loading={loadings.totalSubS1}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCampaignHen
                      Data={DATA.totalSubsHendrick}
                      loading={loadings.totalSubsHendrick}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCampaignMobile
                      Data={DATA.totalSubsMobileArts}
                      loading={loadings.totalSubsMobileArts}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCampaignMobivert
                      Data={DATA.totalSubsMobivert}
                      loading={loadings.totalSubsMobivert}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCampaignLanding
                      Data={DATA.totalSubsGoogle}
                      loading={loadings.totalSubsGoogle}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsCampaignLanding2
                      Data={DATA.totalSubsGoogle2}
                      loading={loadings.totalSubsGoogle2}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsRenewal
                      Data={DATA.totalRenewals}
                      loading={loadings.totalRenewals}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <UnSubs
                      Data={DATA.totalUnsubs}
                      loading={loadings.totalUnsubs}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsLanding
                      Data={DATA.totalSubsLandingPage}
                      loading={loadings.totalSubsLandingPage}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <SubsSms
                      Data={DATA.totalSubSms}
                      loading={loadings.totalSubSms}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Revenue
                      Data={DATA.totalRevenue}
                      rate={DATA.rate}
                      loading1={loadings.rate}
                      loading={loadings.totalRevenue}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Growth
                      Data={DATA.thisMonth}
                      loading={loadings.thisMonth}
                      Data1={DATA.lastMonth}
                      loading1={loadings.lastMonth}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={12}>
                    <ShortCode
                      Data={DATA.shortCode}
                      loading={loadings.shortCode}
                      sx={{ height: "100%" }}
                    />
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
