// *********************************      MAIN PAGE       *************************************

import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Box, Button, Container, Grid, Input, Stack, SvgIcon, TextField, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { PhoneSearch } from "../../sections/mindpalace/history/search-phone";
import { useState, useEffect } from "react";
import { SubscriptionTable } from "../../sections/mindpalace/history/subscription-card";
import { ChargesTable } from "../../sections/mindpalace/history/charge-card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubscriberTable } from "../../sections/mindpalace/history/subscriber-stat";
import { SmsTable } from "../../sections/mindpalace/history/sms";
import { BeatLoader, MoonLoader } from "react-spinners";
import { DateTime } from 'luxon';


const Page = () => {
  const uzbekistanTime = DateTime.now().setZone('Asia/Tashkent');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [loadingSms, setLoadingSms] = useState(false);
  const [sms, setSms] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [fileBlock, setFileBlock] = useState(null);
  const [fileUnsub, setFileUnsub] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {

    if (Cookies.get("username") != "admin") {
      window.location.href = "../auth/login"
    }
    
    try {
      const response = await fetch('http://89.232.186.173:8088/api/checkToken', {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        }
      });
      const jsonData = await response.json();
      if (response.status == 401 ) {
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
    if (phone || success == "true") {
        setLoading(true);
        setLoadingSms(true);
        fetchData();
        fetchDataSms();
    } else {
      // Clear data when no phone is chosen
      setData([]);
      setSms([])
    }
    setSuccess("");

  }, [phone, dateFrom, dateTo, success]);

  const handleSuccess = (msg) => {
    setSuccess(msg)
  }

  const fetchData = async () => {
    try {
      const response = await fetch("http://89.232.186.173:8088/api/subInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
        body: JSON.stringify({
          mobile: phone,
        }),
      });

      const jsonData = await response.json();
      if (jsonData.message == "success") {
        setData(jsonData);
      } else {
        toast.error(jsonData.message, {
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

  const fetchDataSms = async () => {
    try {
      const response = await fetch('http://89.232.186.173:8088/api/sms', {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
        body: JSON.stringify({ mobile: phone }),
      })
      const jsonData = await response.json();
      if (response.status == 200)
      setSms(jsonData.sms)
    else {
      setSms([]);
    }
    } catch (error) {
      toast.error("Error connecting to API: " + error, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setLoadingSms(false);
    }
  }

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


  const Blocklist = async () => {
    const formData = new FormData();
    if (fileBlock) {
      try {
    setLoading(true)
    formData.append("multipartFile", fileBlock);
    const response = await fetch("http://89.232.186.173:8088/api/blockList", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + Cookies.get("mindtoken"),
      },
      body: formData,
    });

    const jsonData = await response.json();

    if (jsonData.message == "Success") {
      setLoading(true);
      setLoadingSms(true);
      fetchData();
      fetchDataSms();
      toast.success(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
    } else {
      toast.error(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    }
  } catch (error) {
    toast.error("Error connecting to API: " + error, {
      position: "bottom-right",
       autoClose: 3000,
      hideProgressBar: true,
      className: "custom-toast-error",
    });
  } finally {
    setLoading(false)
  }
    } else {
      toast.error('Please Select a File', {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    }

};

const Unsublist = async () => {
  const formData = new FormData();
    if (fileUnsub) {
  try {
    setLoading(true);
      formData.append("multipartFile", fileUnsub);
    const response = await fetch("http://89.232.186.173:8088/api/unsubList", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + Cookies.get("mindtoken"),
      },
      body: formData,
    });

    const jsonData = await response.json();

    if (jsonData.message == "Success") {
      setLoading(true);
      setLoadingSms(true);
      fetchData();
      fetchDataSms();
      toast.success(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
      setLoading(false);
    } else {
      toast.error(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
      setLoading(false);
    }
  } catch (error) {
    toast.error("Error connecting to API: " + error, {
      position: "bottom-right",
       autoClose: 3000,
      hideProgressBar: true,
      className: "custom-toast-error",
    });
    setLoading(false);
  }
} else {
  toast.error('Please Select a File', {
    position: "bottom-right",
     autoClose: 3000,
    hideProgressBar: true,
    className: "custom-toast-error",
  });
}
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
        <title>Search Sub | Mind Palace</title>
      </Head>
      {/* CHECKING mindtoken IF NOT AVAILABLE REDIRECT TO LOGIN PAGE */}
      {Cookies.get("mindtoken") ? (
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
            {(Cookies.get('username').toLocaleLowerCase() == 'mindpalace') && (
              <Grid container
              style={{margin:'5px'}}
              spacing={3}>
              <Grid item
                xs={12}
                sm={6}
                md={3} >
                <Grid container
                  spacing={2}
                  direction="column">
                  <Grid item>
                    {/* CALLING FILE FUNCTION */}
                    <Input
                      type="file"
                      accept=".txt"
                      onChange={(event) => setFileUnsub(event.target.files[0])}
                      disableUnderline
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Button variant="contained"
                      color="primary"
                      onClick={Unsublist}
                      disabled={loading}>
                      {loading ? (
                          <BeatLoader />
                        ) : (
                          'Unsub List'
                        )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
    
              <Grid item
                xs={12}
                sm={6}
                md={3} >
                <Grid container
                  spacing={2}
                  direction="column">
                  <Grid item>
                    {/* CALLING FILE FUNCTION */}
                    <Input
                      type="file"
                      accept=".txt"
                      onChange={(event) => setFileBlock(event.target.files[0])}
                      disableUnderline
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Button variant="contained"
                      color="error"
                      onClick={Blocklist}
                      disabled={loading}>
                        {loading ? (
                          <BeatLoader />
                        ) : (
                          'Block List'
                        )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            )}
                <PhoneSearch choosenPhone={handlePhone} />
                {phone &&
            (
              <>
              <Box mt={3}
                  mb={3}>


            <Typography variant="h5">Subscriber</Typography>
            </Box>

            <SubscriberTable data={data.subscriber}
              loading={loading}
              success={handleSuccess}/>
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
            <ChargesTable data={data}
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
                  
            <SubscriptionTable data={data}
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
            <SmsTable data={sms}
                dateFrom={dateFrom}
                dateTo={dateTo}
                loading={loadingSms} />
                </>
                    )}
          </Container>
        </Box>
      ) : (
        <div>{(window.location.href = "../auth/login")}</div> // REDIRECTING TO LOGIN PAGE (NO mindtoken)
      )}

    </>
    )}
    <ToastContainer />
    </>
  );
};

// CALLING THE DASHBOARD LAYOUT (SIDEBAR)
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
