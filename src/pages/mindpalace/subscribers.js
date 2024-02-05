// *********************************     MAIN PAGE     ***************************************

import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import {
  Box,
  Button,
  Container,
  Grid,
  Input,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SubscribersTable } from "src/sections/mindpalace/subscribers/subscribers-table";
import { SubscribersSearch } from "src/sections/mindpalace/subscribers/subscribers-search";
import { useState, useEffect } from "react";
import { SubscriberStat } from "../../sections/mindpalace/subscribers/subscriber-stat";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader, MoonLoader } from "react-spinners";
import { DateTime } from 'luxon';


const Page = () => {
  const uzbekistanTime = DateTime.now().setZone('Asia/Tashkent');
  const [searchQuery, setSearchQuery] = useState("");
  const [operator, setOperator] = useState("0");
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [fileBlock, setFileBlock] = useState(null);
  const [fileUnsub, setFileUnsub] = useState(null);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState('');
  const [Fetch, setFetch] = useState(1);
  const [lastnum, setLastnum] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [operatorCount, setOperatorCount] = useState({
    Uzmobile: 0,
    Ums: 0,
  });

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    checkToken();
  }, [searchQuery, operator ]);

  const checkToken = async () => {

    if ((Cookies.get('username').toLowerCase() !== 'admin')) {
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
      if (response.status == 401) {
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
    fetchDataFirst();
  },[]);

  const handlePrev = () => {
    const newFetch = Fetch - 1;
    setFetch(newFetch);
    fetchData(newFetch);
  }
  
  const handleAfter = () => {
    const newFetch = Fetch + 1;
    setFetch(newFetch);
    fetchData(newFetch);
  }

  const fetchDataFirst = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://89.232.186.173:8088/api/subscribers`, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
      });
      const jsonData = await response.json();
      if (jsonData.message == "Unauthenticated.") {
        window.location.href = "../auth/login"; // REDIRECTING TO LOGIN PAGE
      }

      setFilteredData(jsonData.data);
      setLastnum(jsonData.last_page);
      setTotal(jsonData.total);

    } catch (error) {
      console.log("error fetching data: " + error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`http://89.232.186.173:8088/api/subscribers?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
      });
      const jsonData = await response.json();
      if (jsonData.message == "Unauthenticated.") {
        window.location.href = "../auth/login"; // REDIRECTING TO LOGIN PAGE
      }

      setFilteredData(jsonData.data);
      console.log(jsonData.data + ' 123');

    } catch (error) {
      console.log("error fetching data: " + error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatedOperator = {
      Uzmobile: 0,
      Ums: 0
    };

    filteredData?.forEach((subscriber) => {
      if (subscriber.operator_id === 1) {
        updatedOperator.Uzmobile += 1;
      } else if (subscriber.operator_id === 3) {
        updatedOperator.Ums += 1;
      }
    });
    setOperatorCount(updatedOperator);
  }, [filteredData]);

  const Blocklist = async () => {
      const formData = new FormData();
      if (fileBlock) {
        setLoading(true);
        try {
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
        toast.success(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        setSuccess(jsonData.message);
        setLoading(false);
      } else {
        toast.error(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
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

  const Unsublist = async () => {
    const formData = new FormData();
      if (fileUnsub) {
        setLoading(true);
        try {
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
        toast.success(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        setLoading(false);
        setSuccess(jsonData.message);
      } else {
        toast.error(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        setLoading(false)
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

  // SAVING THE VALUE IN SEARCH USE STATE
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleMessage = (message) => {
    setMessage(message);
  };

  const handleFetch = (page) => {
    setFetch(page);
  };


  const handleOperator = (op) => {
    setOperator(op);
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("subscribers"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "subscribers.xlsx");
  };

  // const handleExport = () => {
  //   const exportData = data.map((entry) => ({
  //     id: entry.id,
  //     mobile: entry.mobile ,
  //     OTP: entry.otp,
  //     Operator: entry.operator.name,
  //     Subscribed: entry.is_subscribed,
  //     Active: entry.is_subscription_active,
  //     Blocked: entry.is_blocked,
  //     Date: entry.updated_at.substring(0,10),
  //   }));

  //   jsonexport(exportData, (err, csv) => {
  //     if (err) {
  //       console.error("Error exporting data:", err);
  //       return;
  //     }

  //     const blob = new Blob([csv], { type: "text/csv" });

  //     const link = document.createElement("a");
  //     link.href = window.URL.createObjectURL(blob);
  //     link.download = "subscribers.csv";
  //     link.click();
  //   });
  // };

  useEffect(() => {
    if (success === "Success") {
      // Fetch data again when the message is "success"
      fetchData(Fetch);
      setSuccess('');
    }
  }, [success]);

  useEffect(() => {
    if (message === "done") {
      // Fetch data again when the message is "success"
      fetchData(Fetch);
      setMessage('');
    }
  }, [message]);

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
      if (selectedDateTo <= uzbekistanTime.toFormat('yyyy-MM-dd')) {
        setDateTo(selectedDateTo); // MAKING SURE NO DATETO CHOOSEN GREATER THAN THE CURRENT DATE
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
        <title>Subscribers | Mind Palace</title>
      </Head>

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
        <Stack
          direction="column"
          justifyContent="space-between"
          spacing={4} >
          <Typography variant="h4">Subscribers</Typography>
          <Grid container
            spacing={2}
            alignItems="center">
            <Grid item
              xs={12}
              sm={4}
              md={3} >
              <TextField
                label="From Date"
                type="date"
                value={dateFrom}
                onChange={handleDateFromChange}
                fullWidth
                inputProps={{
                  max: dateTo? dateTo : uzbekistanTime.toFormat('yyyy-MM-dd'),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item
              xs={12}
              sm={4}
              md={3} >
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
            <Grid item
              xs={6}
              sm={4}
              md={3} >
                <Button onClick={() => (
                  setDateFrom(''),
                  setDateTo('')
                )}
                  style={{ backgroundColor: "#75E6DA", color: "#000" }}
                  >Clear Date</Button>
              </Grid>
          </Grid>
        </Stack>

        {/* CALLING THE SUBSCRIBER STAT FILE WITH DATES AS PROPS */}
        <SubscriberStat total={total}
          loading={loading} />

        <Grid container
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
                  disabled={loading} >
                  {loading ?
                    <BeatLoader />
                  :
                  'UnsubList'
                  }
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
                  disabled={loading} >
                  {loading ?
                    <BeatLoader />
                  :
                  'BlockList'
                  }
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container
          spacing={3}>
          <Grid item
            xs={12}
            sm={6}
            md={6}
            lg={6}>
            {/* EXPORT FUNCTION */}
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
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
          </Grid>
        </Grid>

        {/* CALLING SEARCH FILE WITH SEARCH FUNCTION PROP*/}
        <SubscribersSearch onSearch={handleSearch}
          choosenOp={handleOperator}
          operator={operator} />

        {/* CALLING SUBSCRIBERS TABLE FILE WITH DATE AND OPERATOR PARAMS AS PROPS */}
        <SubscribersTable
          data={filteredData}
          message={handleMessage}
          searchQuery={searchQuery}
          dateFrom={dateFrom}
          dateTo={dateTo}
          operator={operator}
          loading={loading}
          Fetch={handleFetch}
        />

      </Stack>
      <Grid container
        sx={{display:'flex', justifyContent:'space-between'}}
        style={{marginTop:'1rem'}}>

          <Grid item >
          <Button variant="contained"
            color="primary"
            onClick={()=> (
              setFetch(1),
              fetchData(1)
            )}
            disabled={loading || Fetch == 1}>
            FirstPage
          </Button>
          </Grid>
          <Grid item 
            sx={{display:'flex', justifyContent:'space-between', }}>
            <Button variant="contained"
            style={{marginRight:'1rem'}}
              color="primary"
              onClick={handlePrev}
              disabled={loading || Fetch == 1}>
              Previous ({Fetch - 1 })
            </Button>
            <Button variant="contained"
              color="primary"
              onClick={handleAfter}
              disabled={loading || Fetch == lastnum}>
              Next ({1 + Fetch})
            </Button>
          </Grid>
          <Grid item >
          <Button variant="contained"
            color="primary"
            onClick={() => (
              setFetch(lastnum),
              fetchData(lastnum)
            )}
            disabled={loading || Fetch == lastnum}>
            LastPage ({lastnum})
          </Button>
          </Grid>
        </Grid>
    </Container>
  </Box>
) : (
  <div>{(window.location.href = "../auth/login")}</div> // REDIRECTING TO LOGIN PAGE (IF NO TOKEN)
)}
    </>
    )}
    </>
  );
};

// CALLING THE DASHBOARD LAYOUT (SIDEBAR)
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
