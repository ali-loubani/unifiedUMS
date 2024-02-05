import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Button, Grid, SvgIcon, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import { RankingSearch } from "../../sections/guesswho-uzbek/ranking/ranking-search";
import { RankingTable } from "../../sections/guesswho-uzbek/ranking/ranking-table";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const uzbekistanTime = DateTime.now().setZone("Asia/Tashkent");
  const [dateFrom, setDateFrom] = useState(
    uzbekistanTime.toFormat("yyyy-MM-dd")
  );
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  const [operator, setOperator] = useState("0");

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

  const handleDateFromChange = (event) => {
    const selectedDateFrom = event.target.value;
    setDateFrom(selectedDateFrom);
    if (selectedDateFrom > dateTo) {
      setDateTo(selectedDateFrom);
    }
  };

  const handleDateToChange = (event) => {
    const selectedDateTo = event.target.value;
    if (selectedDateTo <= uzbekistanTime.toFormat("yyyy-MM-dd")) {
      setDateTo(selectedDateTo);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDataDate();
  }, [operator]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://82.148.6.228:3000/ranking?operator=" + operator
      );
      const jsonData = await response.json();
      setData(jsonData.ranking);
    } catch (error) {
      console.log("Error fetching API: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleOperator = (op) => {
    setOperator(op);
  };

  const handlefilter = () => {
    fetchDataDate();
  };

  const fetchDataDate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://82.148.6.228:3000/ranking?from=" +
          dateFrom +
          "&to=" +
          dateTo +
          (operator == 0 ? "" : "&operator=" + operator)
      );
      const jsonData = await response.json();
      setData(jsonData.ranking);
    } catch (error) {
      console.log("Error fetching API: " + error);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(
      document.getElementById("ranking")
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "ranking.xlsx");
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
            <title>Ranking | Guess Who</title>
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
                  <Grid container spacing={2}>
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
                      >
                        Search
                      </Button>
                    </Grid>
                  </Grid>
                </Stack>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
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
                <RankingSearch choosenOp={handleOperator} operator={operator} />

                <RankingTable data={data} loading={loading} />
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
