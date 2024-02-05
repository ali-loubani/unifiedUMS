import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import {
  Button,
  Grid,
  Input,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SubscriberStat } from "../../sections/guesswho-uzbek/subscribers/subscribers-stat";
import { SubscribersSearch } from "../../sections/guesswho-uzbek/subscribers/subscriber-search";
import { SubscribersTable } from "../../sections/guesswho-uzbek/subscribers/subscriber-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader, MoonLoader } from "react-spinners";
import * as XLSX from "xlsx";
import Cookies from "js-cookie";
import { DateTime } from "luxon";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operator, setOperator] = useState("0");
  const uzbekistanTime = DateTime.now().setZone("Asia/Tashkent");
  const [dateFrom, setDateFrom] = useState(
    uzbekistanTime.toFormat("yyyy-MM-dd")
  );
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  const [fileBlock, setFileBlock] = useState(null);
  const [fileUnsub, setFileUnsub] = useState(null);
  const [success, setSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsubLoading, setUnsubLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [operatorCount, setOperatorCount] = useState({
    UMS: 0,
    Uzmobile: 0,
  });

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {

    if (Cookies.get("username") != "admin") {
      window.location.href = "../auth/login"
    }

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
      console.log("Error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://82.148.6.228:3000/subscribers");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handlefilter = () => {
    fetchDataDate();
  };

  const fetchDataDate = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://82.148.6.228:3000/subscribers?from=" +
          dateFrom +
          "&to=" +
          dateTo
      );
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log("error fetching data: " + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatedOperator = {
      UMS: 0,
      Uzmobile: 0,
    };

    data &&
      data.results?.forEach((subscriber) => {
        if (subscriber.operatorId == 1) {
          // UZMOBILE SUBSCRIBERS
          updatedOperator.Uzmobile += 1;
        } else if (subscriber.operatorId == 2) {
          // UMS SUBSCRIBRES
          updatedOperator.UMS += 1;
        }
      });
    setOperatorCount(updatedOperator);
  }, [data.results]);

  // BLOCK API
  const Blocklist = async () => {
    const formData = new FormData();
    if (fileBlock) {
      setBlockLoading(true);
      try {
        formData.append("multipartFile", fileBlock);
        const response = await fetch(
          "http://82.148.6.228:8084/api/v1/blockList",
          {
            method: "POST",
            headers: {
              accept: "application/json",
            },
            body: formData,
          }
        );

        if (response.status == 200) {
          toast.success("Success", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            className: "custom-toast-success",
          });
          setSuccess("Success");
        }
      } catch (error) {
        toast.error("Error connecting to API: " + error, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      } finally {
        setBlockLoading(false);
      }
    } else {
      toast.error("Please Select a File", {
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
      setUnsubLoading(true);
      try {
        formData.append("multipartFile", fileUnsub);
        const response = await fetch(
          "http://82.148.6.228:8084/api/v1/unSubList",
          {
            method: "POST",
            headers: {
              accept: "application/json",
            },
            body: formData,
          }
        );
        if (response.status == 200) {
          toast.success("Success", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            className: "custom-toast-success",
          });
          setSuccess("Success");
        }
      } catch (error) {
        toast.error("Error connecting to API: " + error, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      } finally {
        setUnsubLoading(false);
      }
    } else {
      toast.error("Please Select a File", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    }
  };

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

  // SAVING THE VALUE IN SEARCH USE STATE
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleMessage = (message) => {
    setMessage(message);
  };

  const handleOperator = (op) => {
    setOperator(op);
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(
      document.getElementById("subscribers")
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "subscribers.xlsx");
  };

  useEffect(() => {
    if (success === "Success") {
      // Fetch data again when the message is "success"
      fetchData();
      setSuccess("");
    }
  }, [success]);

  useEffect(() => {
    if (message === "done") {
      // Fetch data again when the message is "success"
      fetchData();
      setMessage("");
    }
  }, [message]);

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
            <title>Subscribers | Guess Who</title>
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
                <Stack
                  direction="column"
                  justifyContent="space-between"
                  spacing={4}
                >
                  <Typography variant="h4">Subscribers</Typography>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
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
                    <Grid item xs={12} sm={6} md={3}>
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
                      <Button
                        onClick={handlefilter}
                        style={{ backgroundColor: "#75E6DA", color: "#000" }}
                        disabled={loading}
                      >
                        {loading ? <BeatLoader /> : "Search"}
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>

                {/* CALLING THE SUBSCRIBER STAT FILE WITH DATES AS PROPS */}
                <SubscriberStat
                  data={data}
                  operatorCount={operatorCount}
                  loading={loading}
                />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        {/* CALLING FILE FUNCTION */}
                        <Input
                          type="file"
                          accept=".txt"
                          onChange={(event) =>
                            setFileUnsub(event.target.files[0])
                          }
                          disableUnderline
                          fullWidth
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={Unsublist}
                          disabled={unsubLoading}
                        >
                          {unsubLoading ? <BeatLoader /> : "Unsub List"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Grid container spacing={2} direction="column">
                      <Grid item>
                        {/* CALLING FILE FUNCTION */}
                        <Input
                          type="file"
                          accept=".txt"
                          onChange={(event) =>
                            setFileBlock(event.target.files[0])
                          }
                          disableUnderline
                          fullWidth
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={Blocklist}
                          disabled={blockLoading}
                        >
                          {blockLoading ? <BeatLoader /> : "Block List"}
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    {/* EXPORT FUNCTION */}
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
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
                <SubscribersSearch
                  onSearch={handleSearch}
                  choosenOp={handleOperator}
                  operator={operator}
                />

                {/* CALLING SUBSCRIBERS TABLE FILE WITH DATE AND OPERATOR PARAMS AS PROPS */}
                <SubscribersTable
                  data={data}
                  message={handleMessage}
                  searchQuery={searchQuery}
                  operator={operator}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  loading={loading}
                />
              </Stack>
            </Container>
          </Box>
          <ToastContainer />
        </>
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
