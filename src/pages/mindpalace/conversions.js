import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Button, Grid, SvgIcon, TextField, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BeatLoader, MoonLoader } from "react-spinners";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import { ConversionsSearch } from "../../sections/mindpalace/conversions/conversion-search";
import { ConversionsTable } from "../../sections/mindpalace/conversions/conversion-table";

const Page = () => {
  const [data, setData] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [callback, setCallback] = useState("2");
  const uzbekistanTime = DateTime.now().setZone("Asia/Tashkent");
  const [dateFrom, setDateFrom] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    checkToken();
    fetchData();
  }, []);

  const checkToken = async () => {
    
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

  const fetchData = async () => {
    try {
      const response = await fetch("http://89.232.186.173:8088/api/conversions", {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
      });

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataDate = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://89.232.186.173:8088/api/conversions?from=" + dateFrom + "&to=" + dateTo,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
        }
      );
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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCallback = (call) => {
    setCallback(call);
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("conversions"));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "conversions.xlsx");
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
            <title>Conversions | Mind Palace</title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            <Container maxWidth="xl">
              <Stack direction="row" 
                justifyContent="space-between" 
                spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Conversions</Typography>
                </Stack>
              </Stack>
              <Stack direction="column" 
                justifyContent="space-between" 
                spacing={4}>
                <Grid container 
                  alignItems="center" 
                  spacing={2}>
                  <Grid item 
                    xs={12} 
                    sm={6} 
                    md={3}>
                    <TextField
                      label="From Date"
                      type="date"
                      value={dateFrom}
                      onChange={handleDateFromChange}
                      fullWidth
                      inputProps={{
                        max: uzbekistanTime.toFormat("yyyy-MM-dd"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item 
                    xs={12} 
                    sm={6} 
                    md={3}>
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
              <ConversionsSearch
                onSearch={handleSearch}
                choosenCallBack={handleCallback}
                callback={callback}
              />
              <ConversionsTable
                data={data}
                loading={loading}
                callback={callback}
                dateFrom={dateFrom}
                dateTo={dateTo}
                searchQuery={searchQuery}
              />
            </Container>
          </Box>
        </>
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
