import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Button, Grid, Modal, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SponsorsTable } from "../../sections/guesswho-uzbek/sponsors/sponsor-table";
import * as XLSX from "xlsx";
import { BeatLoader, MoonLoader } from "react-spinners";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addsponsor, setAddSponsor] = useState(false);
  const [sponsor, setSponsor] = useState({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {

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
      const response = await fetch("http://82.148.6.228:3000/sponsors");

      const jsonData = await response.json();
      setData(jsonData.sponsors);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const add = (e) => {
    e.preventDefault();
    setAddSponsor(true);
  };

  const handleChange = (sponsorInfo, value) => {
    setSponsor((prevSponsor) => ({
      ...prevSponsor,
      [sponsorInfo]: value,
    }));
  };

  const Addsponsor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://82.148.6.228:3000/sponsors/addSponsor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify(sponsor),
      });

      const jsonData = await response.json();
      if (response.status == 200) {
        fetchData();
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
      setLoading(false);
      setAddSponsor(false);
    }
  };

  const handleMessage = (msg) => {
    setMessage(msg);
  };

  useEffect(() => {
    if (message == "success") {
      fetchData();
      setMessage("");
    }
  }, [message]);

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(
      document.getElementById("sponsors")
    );

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "sponsors.xlsx");
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
            <title>Sponsors | Guess Who</title>
          </Head>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8,
            }}
          >
            <Container maxWidth="xl">
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Sponsors</Typography>
                </Stack>
              </Stack>
              <Grid container justifyContent="space-between">
                <Stack alignItems="center" direction="row" spacing={1}>
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
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={(e) => add(e)} // CALLING THE ADD FUNCTION
                >
                  Add New sponsor
                </Button>
              </Grid>
              <SponsorsTable
                data={data}
                loading={loading}
                message={handleMessage}
              />
            </Container>
          </Box>
          <Modal open={addsponsor} onClose={() => setAddSponsor(false)}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <div
                style={{
                  borderRadius: "1.5rem",
                  width: "91.666667%",
                  backgroundColor: "#f9f9f9",
                  padding: "20px",
                  maxWidth: "600px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "10px",
                    fontSize: "1.2rem",
                    color: "#333",
                  }}
                >
                  Add New Sponsor
                </p>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <table style={{ width: "100%", margin: "0 auto" }}>
                    <tbody>
                      <tr>
                        <td
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            lineHeight: "1.5rem",
                          }}
                        >
                          Name:
                        </td>
                        <td>
                          <input
                            type="text"
                            onChange={(e) =>
                              handleChange("name", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "0.5rem",
                              outline: "none",
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            lineHeight: "1.5rem",
                          }}
                        >
                          Callback URL:
                        </td>
                        <td>
                          <input
                            type="text"
                            onChange={(e) =>
                              handleChange("callback_url", e.target.value)
                            }
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "0.5rem",
                              outline: "none",
                            }}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" style={{ textAlign: "right" }}>
                          <Button
                            onClick={() => setAddSponsor(false)}
                            style={{
                              backgroundColor: "#6366F1",
                              color: "#fff",
                              borderRadius: "0.5rem",
                              padding: "0.5rem 1rem",
                              fontSize: "1rem",
                              marginRight: "1rem",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={(e) => Addsponsor(e)}
                            style={{
                              backgroundColor: "#6366F1",
                              color: "#fff",
                              borderRadius: "0.5rem",
                              padding: "0.5rem 1rem",
                              fontSize: "1rem",
                              cursor: "pointer",
                            }}
                            disabled={loading}
                          >
                            {loading ? <BeatLoader /> : "Confirm"}
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>

          <ToastContainer />
        </>
      )}
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
