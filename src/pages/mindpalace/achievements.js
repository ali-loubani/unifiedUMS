import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Button, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Cookies from "js-cookie";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import { AchievementTable } from "../../sections/mindpalace/achievements/achievement-table";
import { AchievementSearch } from "../../sections/mindpalace/achievements/search-achievement";


const Page = () => {

  const [searchQuery, setSearchQuery] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkToken();
    fetchData();
  }, []);

  useEffect(() => {
    checkToken();
  }, [searchQuery]);

  const handleMessage = (message) => {
    setMessage(message);
  }

  useEffect(()=> {
    if(message == 'done') {
      fetchData();
      setMessage('');
    }
  },[message])


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

  const fetchData = async () => {
    try {
      const response = await fetch("http://89.232.186.173:8088/api/achievements", {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
      if (jsonData.message == "Unauthenticated.") {
        window.location.href = "../auth/login"; // redirect to login page
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("achievements"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "achievements.xlsx");
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
        <title>Achievements | Mind Palace</title>
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
              <Typography variant="h4">Achievements</Typography>
            </Stack>
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
          <AchievementSearch onSearch={handleSearch} />
          <AchievementTable searchQuery={searchQuery} 
            data={data}
            loading={loading}
            message={handleMessage}/>
        </Container>
      </Box>
    </>
    )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
