import { Button, Grid, MenuItem, Modal, Select, SvgIcon, Typography } from "@mui/material";
import { Box, Container, Stack } from "@mui/system";
import Cookies from "js-cookie";
import Head from "next/head";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { UsersTable } from "../../sections/mindpalace/users/users-table";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import * as XLSX from "xlsx";
import { BeatLoader, MoonLoader } from "react-spinners";

const Page = () => {
  const [addUser, setAddUser] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

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

  const add = (e) => {
    e.preventDefault();
    setAddUser(true);
  };

  const handleChange = (userInfo, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [userInfo]: value,
    }));
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("users"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const Adduser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://89.232.186.173:8088/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
        body: JSON.stringify(user),
      });

      const jsonData = await response.json();
      if (response.status == 201) {
        setAddUser(false);
        toast.success(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        setMessage(response.status);
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
      setLoading(false)
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
        <title>Users | Mind Palace</title>
      </Head>
      {Cookies.get("mindtoken") ? ( // CHECKING IF THERE'S TOKEN
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
                  <Typography variant="h4">Users</Typography>
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
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={(e) => add(e)} // CALLING THE ADD FUNCTION
                >
                  Add New User
                </Button>
              </Grid>
              <UsersTable message={message} />
            </Stack>
          </Container>
        </Box>
      ) : (
        <div>{(window.location.href = "../auth/login")}</div> // REDIRECTING TO LOGIN PAGE (IF NO TOKEN)
      )}
      {/* OPEN ADD GAME MODEL AFTER PRESSING ADDGAME BUTTON */}
      <Modal open={addUser}
      onClose={() => setAddUser(false)}>
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
              Add New User
            </p>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", margin: "0 auto" }}>
                <tbody>
                  <tr>
                    <td style={{ fontSize: "0.9rem", fontWeight: "bold", lineHeight: "1.5rem" }}>
                      Username:
                    </td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => handleChange("username", e.target.value)}
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
                    <td style={{ fontSize: "0.9rem", fontWeight: "bold", lineHeight: "1.5rem" }}>
                      Permission:
                    </td>
                    <td>
                    <Select
                      id="categories"
                      style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        border: "1px solid #ccc",
                        borderRadius: "0.5rem",
                        outline: "none",
                      }}
                      onChange={(e) => handleChange("permission", e.target.value)}
                    >
                      <MenuItem value='Admin'>Admin</MenuItem>
                      <MenuItem value='Uzmobile'>UZmobile</MenuItem>
                      <MenuItem value='Ums'>Ums</MenuItem>
                      {/* <MenuItem value='Ucell'>Ucell</MenuItem> */}

                    </Select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontSize: "0.9rem", fontWeight: "bold", lineHeight: "1.5rem" }}>
                      Email:
                    </td>
                    <td>
                      <input
                        type="email"
                        onChange={(e) => handleChange("email", e.target.value)}
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
                    <td style={{ fontSize: "0.9rem", fontWeight: "bold", lineHeight: "1.5rem" }}>
                      Password:
                    </td>
                    <td>
                      <input
                        type="password"
                        onChange={(e) => handleChange("password", e.target.value)}
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
                    <td style={{ fontSize: "0.9rem", fontWeight: "bold", lineHeight: "1.5rem" }}>
                      Confirm Password:
                    </td>
                    <td>
                      <input
                        type="password"
                        onChange={(e) => handleChange("password_confirmation", e.target.value)}
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
                    <td colSpan="2"
                    style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => setAddUser(false)}
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
                        onClick={(e) => Adduser(e)}
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
                        {loading ? (
                          <BeatLoader />
                        ) : (
                          'Add'
                        )}
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
