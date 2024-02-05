//  *********************************     SUBSCRIBERS TABLE     ***************************************

import {
    Box,
    Button,
    Card,
    CircularProgress,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
  } from "@mui/material";
  import { Scrollbar } from "src/components/scrollbar";
  import React, { useState } from "react";
  import Cookies from "js-cookie";
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  export const SubscriberTable = ({ data, loading }) => {
    const [isUnsubOpen, setUnsubOpen] = useState(false);
    const [isUnblockOpen, setUnblockOpen] = useState(false);
    const [isBlockOpen, setBlockOpen] = useState(false);

    // BLOCK API
    const block = async (e) => {
      e.preventDefault();
      setBlockOpen(true);
    };

    const handleConfirmBlock = async () => {
      try {
        const response = await fetch("http://82.148.2.56:8088/api/block", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("usertoken"),
          },
          body: JSON.stringify({ lang: "en-US", mobile: data[0].mobile }),
        });

        const data = await response.json();

        // Use toast.success for success message or toast.error for error message
        toast.success(data.data.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });

        fetchData();
      } catch (error) {
        console.log("Error connecting to API: ", error);
        toast.error("Error connecting to API. Please try again later.", {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      }
      // Close the modal after handling the confirmation
      setBlockOpen(false);
    };

    const handleCancelBlock = () => {
      // Close the modal if the user cancels
      setBlockOpen(false);
    };

    // UNBLOCK API
    const unblock = async (e) => {
      e.preventDefault();
      setUnblockOpen(true);
    };
    const handleConfirmUnblock = async () => {
      try {
        const response = await fetch("http://82.148.2.56:8088/api/unblock/" + data[0].id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("usertoken"),
          },
          body: JSON.stringify({ lang: "en-US" }),
        });

        const data = await response.json();

        // Use toast.success for success message or toast.error for error message
        toast.success(data.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });

        fetchData();
      } catch (error) {
        console.log("Error connecting to API: ", error);
        toast.error("Error connecting to API. Please try again later.", {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      }

      // Close the modal after handling the confirmation
      setUnblockOpen(false);
    };

    const handleCancelUnblock = () => {
      // Close the modal if the user cancels
      setUnblockOpen(false);
    };

    // UNSUB API
    const unSub = async (e) => {
      e.preventDefault();
      setUnsubOpen(true);
    };

    const handleConfirmUnsub = async () => {
      try {
        const response = await fetch("http://82.148.2.56:8088/api/unsub", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("usertoken"),
          },
          body: JSON.stringify({ mobile: data[0].mobile, lang: "en-US" }),
        });

        const data = await response.json();

        // Use toast.success for success message or toast.error for error message
        toast.success(data.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        fetchData();
      } catch (error) {
        toast.error("Error connecting to API" + error, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      }

      // Close the modal after handling the confirmation
      setUnsubOpen(false);
    };

    const handleCancelUnsub = () => {
      // Close the modal if the user cancels
      setUnsubOpen(false);
    };
    const modalStyles = {
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      content: {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        maxWidth: "400px",
        width: "90%",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#dddddd",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      },
    };

    return (
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="subscriber">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Mobile</TableCell>
                  <TableCell align="center">OTP</TableCell>
                  <TableCell align="center">Operator</TableCell>
                  <TableCell align="center">Subscribed</TableCell>
                  <TableCell align="center">Active Subscription</TableCell>
                  <TableCell align="center">Blocked</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {data.length > 0 ? (
                    <TableRow hover
                        key={data.id}>
                        <TableCell align="center">{data[0].id}</TableCell>
                        <TableCell align="center">{data[0].mobile}</TableCell>
                        <TableCell align="center">{data[0].otp}</TableCell>
                        <TableCell align="center">{data[0].operator && data[0].operator.name}</TableCell>
                        <TableCell align="center">
                          {/* IF SUBSCRIBED => YES ELSE NO */}
                          {data[0].is_subscribed === 1 ? "yes" : "no"}
                        </TableCell>
                        <TableCell align="center">
                          {/* IF ACTIVE => YES ELSE NO */}
                          {data[0].is_subscription_active === 1 ? "yes" : "no"}
                        </TableCell>
                        <TableCell align="center">
                          {data[0].is_blocked === 1 ? "yes" : "no"} {/* IF BLOCKED => YES ELSE NO */}
                        </TableCell>
                        {/* DISPLAY ONLY DATE WITHOUT THE TIME*/}
                        <TableCell align="center">{data[0].created_at.substring(0, 19)}</TableCell>
                        <TableCell>
                          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            {/* IF SUBSCRIBER NOT BLOCKED DISPLAY 'BLOCK' AND 'UNSUB' BUTTONS */}
                            {data[0].is_blocked == "0" ? (
                              data[0].is_subscribed ? (
                                <>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                      marginRight: "0.5rem",
                                      borderRadius: "0.375rem",
                                      width: "50%",
                                    }}
                                    onClick={(e) => unSub(e)}
                                  >
                                    Unsub
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    style={{
                                      marginLeft: "0.5rem",
                                      borderRadius: "0.375rem",
                                      width: "50%",
                                    }}
                                    onClick={(e) => block(e)}
                                  >
                                    Block
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="contained"
                                  color="error"
                                  style={{
                                    borderRadius: "0.375rem",
                                    width: "auto",
                                  }}
                                  onClick={(e) => block(e)}
                                >
                                  Block
                                </Button>
                              )
                            ) : (
                              <div>
                                <Button
                                  variant="contained"
                                  color="success"
                                  style={{
                                    borderRadius: "0.375rem",
                                    width: "auto",
                                  }}
                                  onClick={(e) => unblock(e)}
                                >
                                  Unblock
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                ) : (
                    <TableRow>
                    <TableCell colSpan={9}
                    align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
            </Table>
          </Box>
        </Scrollbar>
        <Modal open={isUnsubOpen}
          onClose={handleCancelUnsub}
          style={modalStyles}>
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
                borderRadius: "1rem",
                width: "90%",
                maxWidth: "600px",
                backgroundColor: "#f9f9f9",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center", color: "#333" }}>
                Confirmation
              </h2>
              <p
                style={{
                  marginBottom: "2rem",
                  textAlign: "center",
                  color: "#555",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Are you sure you want to unsubscribe this subscriber?
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#6366F1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    color: "#fff",
                    marginRight: "1rem",
                  }}
                  onClick={handleCancelUnsub}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#6366F1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    color: "#fff",
                  }}
                  onClick={() => handleConfirmUnsub()}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <Modal open={isUnblockOpen}
          onClose={handleCancelUnblock}
          style={modalStyles}>
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
                borderRadius: "1rem",
                width: "90%",
                maxWidth: "600px",
                backgroundColor: "#f9f9f9",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center", color: "#333" }}>
                Confirmation
              </h2>
              <p
                style={{
                  marginBottom: "2rem",
                  textAlign: "center",
                  color: "#555",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Are you sure you want to unblock this subscriber?
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#6366F1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    color: "#fff",
                    marginRight: "1rem",
                  }}
                  onClick={handleCancelUnblock}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#6366F1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    color: "#fff",
                  }}
                  onClick={() => handleConfirmUnblock()}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <Modal open={isBlockOpen}
          onClose={handleCancelBlock}
          style={modalStyles}>
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
                borderRadius: "1rem",
                width: "90%",
                maxWidth: "600px",
                backgroundColor: "#f9f9f9",
                padding: "20px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2 style={{ marginBottom: "1rem", textAlign: "center", color: "#333" }}>
                Confirmation
              </h2>
              <p
                style={{
                  marginBottom: "2rem",
                  textAlign: "center",
                  color: "#555",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Are you sure you want to block this subscriber?
              </p>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#6366F1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    color: "#fff",
                    marginRight: "1rem",
                  }}
                  onClick={handleCancelBlock}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    backgroundColor: "#6366F1",
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    color: "#fff",
                  }}
                  onClick={() => handleConfirmBlock()}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <ToastContainer />
      </Card>
    );
  };
