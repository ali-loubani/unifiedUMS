import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import {
  Button,
  Grid,
  MenuItem,
  Select,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import Head from "next/head";
import { useEffect, useState } from "react";
import { BeatLoader, MoonLoader } from "react-spinners";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import { DailyTable } from "../../sections/mindpalace/daily-statistics/daily-table";

const Page = () => {
  const [data, setData] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const uzbekistanTime = DateTime.now().setZone("Asia/Tashkent");
  const [dateFrom, setDateFrom] = useState(
    uzbekistanTime.toFormat("yyyy-MM-dd")
  );
  const [dateTo, setDateTo] = useState(uzbekistanTime.toFormat("yyyy-MM-dd"));
  const [operator, setOperator] = useState(0);
  const [campaign, setCampaign] = useState("all");

  useEffect(() => {
    checkToken();
    fetchDataDate();
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

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://taxmin-qil.uz/cms/include/daily_report_statistics.php"
  //     );

  //     const jsonData = await response.json();
  //     setData(jsonData);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchDataDate = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://89.232.186.173:8088/api/dailyStatistics?from=" +
          dateFrom +
          "&to=" +
          dateTo +
          "&operator=" +
          operator +
          (campaign != "all" ? "&campaign=" + campaign : ""),
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

  const handlefilter = () => {
    fetchDataDate();
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(
      document.getElementById("daily-mindpalace")
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "daily-statistics.xlsx");
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
            <title>Daily Statistics | Mind Palace</title>
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
                  <Typography variant="h4">Daily Statistics</Typography>
                </Stack>
              </Stack>
              <Grid container 
                alignItems="center" 
                spacing={2}>
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
                  </Select>
                </Grid>
                <Grid item>
                  <Select
                    variant="outlined"
                    value={campaign}
                    onChange={(e) => {
                      setCampaign(e.target.value);
                    }}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="2">campaign 2</MenuItem>
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
              <DailyTable
                data={data}
                loading={loading}
                dateFrom={dateFrom}
                dateTo={dateTo}
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
