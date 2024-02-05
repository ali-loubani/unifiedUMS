import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Button, Grid, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Cookies from "js-cookie";
import Head from "next/head";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import * as XLSX from "xlsx";
import { OperatorSearch } from "../../sections/gamebay/sms/operator-search";
import { SMSTable } from "../../sections/gamebay/sms/sms-table";

const Page = () => {
  const [message, setMessage] = useState();
  const [operator, setOperator] = useState(1)
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {

    if (Cookies.get("username") != "admin") {
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

  const handleOperator = (op) => {
    setOperator(op);
  };


  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("sms"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "sms.xlsx");
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
        <title>SMS | Game Bay</title>
      </Head>
      {Cookies.get("usertoken") ? ( // CHECKING IF THERE'S TOKEN
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
                  <Typography variant="h4">SMS Templates</Typography>
                </Stack>
              </Stack>
              <Grid container
              justifyContent="space-between">
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
              </Grid>
              <OperatorSearch
                choosenOp={handleOperator}
                operator={operator}
              />
              <SMSTable message={message}
              choosenOp={operator} />
            </Stack>
          </Container>
        </Box>
      ) : (
        <div>{(window.location.href = "../auth/login")}</div> // REDIRECTING TO LOGIN PAGE (IF NO TOKEN)
      )}

      <ToastContainer />
    </>
    )}
    </>
  );
};
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
