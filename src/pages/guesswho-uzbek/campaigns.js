import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import {
  Button,
  FormControlLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CampaignsTable } from "../../sections/guesswho-uzbek/campaigns/campaign-table";
import * as XLSX from "xlsx";
import { BeatLoader, MoonLoader } from "react-spinners";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";

const Page = () => {
  const [data, setData] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [addCampaign, setAddCampaign] = useState(false);
  const [campaign, setCampaign] = useState({
    callback_url: 1,
  });
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
      const response = await fetch("http://82.148.6.228:3000/campaigns");

      const jsonData = await response.json();
      setData(jsonData.campaigns);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch("http://82.148.6.228:3000/sponsors");

      const jsonData = await response.json();
      jsonData.sponsors.map((sponsor) => {
        setSponsors((prevSpon) => ({
          ...prevSpon,
          [sponsor.id]: sponsor.name,
        }));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const add = (e) => {
    e.preventDefault();
    setAddCampaign(true);
  };

  const handleChange = (campaignInfo, value) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
      [campaignInfo]: value,
    }));
  };

  const AddCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://82.148.6.228:3000/campaigns/addCampaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify(campaign),
      });

      const jsonData = await response.json();
      if (response.status == 201) {
        fetchData();
        toast.success("success", {
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
      setAddCampaign(false);
      setLoading(false);
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
      document.getElementById("campaigns")
    );

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
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Campaigns</Typography>
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
                  Add New Campaign
                </Button>
              </Grid>
              <CampaignsTable
                data={data}
                loading={loading}
                sponsors={sponsors}
                message={handleMessage}
              />
            </Container>
          </Box>
          <Modal open={addCampaign} onClose={() => setAddCampaign(false)}>
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
                  Add New Campaign
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
                          Sponsor:
                        </td>
                        <td>
                          <RadioGroup
                            id="categories"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flex: 1,
                              color: "#000",
                            }}
                            onChange={(e) =>
                              handleChange("sponsorId", e.target.value)
                            }
                          >
                            {Object.entries(sponsors).map((sponsor) => (
                              <FormControlLabel
                                key={sponsor[0]}
                                value={sponsor[0]}
                                control={<Radio />}
                                label={sponsor[1]}
                              />
                            ))}
                          </RadioGroup>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" style={{ textAlign: "right" }}>
                          <Button
                            onClick={() => setAddCampaign(false)}
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
                            onClick={(e) => AddCampaign(e)}
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
