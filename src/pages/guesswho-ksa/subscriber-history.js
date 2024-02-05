// *********************************      MAIN PAGE       *************************************

import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Box, Button, Container, Grid, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { PhoneSearch } from "../../sections/guesswho-ksa/history/search-phone";
import { useState, useEffect } from "react";
import { SubscriptionTable } from "../../sections/guesswho-ksa/history/subscription-card";
import { ChargesTable } from "../../sections/guesswho-ksa/history/charge-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubscriberStat } from "../../sections/guesswho-ksa/history/subscriber-stat";
import { SmsTable } from "../../sections/guesswho-ksa/history/sms";
import { MoonLoader } from "react-spinners";
import { DateTime } from "luxon";


const Page = () => {
  const uzbekistanTime = DateTime.now().setZone('Asia/Tashkent');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    if ((Cookies.get('username').toLowerCase() !== 'admin')) {
      window.location.href = "../auth/login"
    }
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

  const handlePhone = (ph) => {
    setPhone(ph);
  };

  // TAKING DATEFROM AND SAVING IT IN A USESTATE
  const handleDateFromChange = (e) => {
    const selectedDateFrom = e.target.value;
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

  useEffect(() => {
    if (phone) {
        setLoading(true);
        fetchData();
    } else {
      // Clear data when no phone is chosen
      setData([]);
    }
  }, [phone, dateFrom, dateTo]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://guesswhoservice.com/api/subinfo.php?mobile=" + phone, {
        method: "GET",
      });

      const jsonData = await response.json();
      if (response.status == 200) {
        setData(jsonData);
      } else {
        toast.error('No Data', {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        setData([]);
      }
    } catch (error) {
      toast.error("Error connecting to API: " + error, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setLoading(false); // disappear loading progress
    }
  };

const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("charges"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "Charges.xlsx");
  };

  const handleExport1 = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("history"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "exported_data.xlsx");
  };
  const handleExport2 = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("sms"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "exported_data.xlsx");
  };


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
        <title>Search Sub | Guess Who</title>
      </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack direction="row"
              justifyContent="space-between"
              spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Subscriber History</Typography>
                  <Grid container
                  spacing={2}>
                    <Grid item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}>
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
                    sm={6}
                    md={6}
                    lg={6}>
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
                  </Grid>
                </Stack>
              </Stack>
            </Stack>
                <PhoneSearch choosenPhone={handlePhone} />
                {phone &&
                <>
                <Box mt={3}
                  mb={3}>
            <Typography variant="h5">Subscriber</Typography>
            </Box>
            <SubscriberStat data={data.user}

              loading={loading}/>
            <Box mt={3}>
            <Typography variant="h5">Charges</Typography>
            </Box>
            <Stack alignItems="center"
                  direction="row"
                  spacing={1}>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowDownOnSquareIcon />
                        </SvgIcon>
                      }
                      onClick={handleExport}
                    >
                      Export
                    </Button>
                  </Stack>
            <ChargesTable data={data.user_charge}
                choosenPhone={phone}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={loading} />
            <Box mt={3}>
            <Typography variant="h5">Subs History</Typography>
            </Box>
            <Stack alignItems="center"
                  direction="row"
                  spacing={1}>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowDownOnSquareIcon />
                        </SvgIcon>
                      }
                      onClick={handleExport1}
                    >
                      Export
                    </Button>
                  </Stack>
            <SubscriptionTable data={data.subscription_history}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={loading} />
                <Box mt={3}>
            <Typography variant="h5">SMS Received</Typography>
            </Box>
            <Stack alignItems="center"
                  direction="row"
                  spacing={1}>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowDownOnSquareIcon />
                        </SvgIcon>
                      }
                      onClick={handleExport2}
                    >
                      Export
                    </Button>
                  </Stack>
            <SmsTable data={data.sms}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={loading} />
                    </>}
          </Container>
        </Box>
        <ToastContainer />
    </>
    )}
    </>
  );
};

// CALLING THE DASHBOARD LAYOUT (SIDEBAR)
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
