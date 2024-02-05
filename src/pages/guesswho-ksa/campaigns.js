import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Button, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CampaignsTable } from "../../sections/guesswho-ksa/campaigns/campaign-table";
import * as XLSX from "xlsx";
import { MoonLoader } from "react-spinners";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


const Page = () => {

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

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

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("campaigns"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "campaigns.xlsx");
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
        <title>Campaigns | Guess Who</title>
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
              <Typography variant="h4">Campaigns</Typography>
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
          <CampaignsTable />
        </Container>
      </Box>
    </>
    )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
