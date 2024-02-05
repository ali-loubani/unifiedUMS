//  *********************************     SUBSCRIBER TABLE     ***************************************

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
import { BeatLoader } from "react-spinners";

  export const SubscriberTable = ({ data, loading, success }) => {
    const [isUnsubOpen, setUnsubOpen] = useState(false);
    const [isUnblockOpen, setUnblockOpen] = useState(false);
    const [isBlockOpen, setBlockOpen] = useState(false);
    const [load, setLoad] = useState(false)

    // BLOCK API
    const block = async (e) => {
      e.preventDefault();
      setBlockOpen(true);
    };

    const handleConfirmBlock = async () => {
      setLoad(true)
      try {
        const response = await fetch("http://89.232.186.173:8088/api/block", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: JSON.stringify({ lang: "en-US", mobile: data.mobile }),
        });

        const dataa = await response.json();
        
        success('true');
        // Use toast.success for success message or toast.error for error message
        toast.success(dataa.data.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });

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
      setLoad(false);
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
      setLoad(true);
      try {
        const response = await fetch("http://89.232.186.173:8088/api/unblock/" + data.id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: JSON.stringify({ lang: "en-US" }),
        });

        const dataa = await response.json();
        success('true');
        // Use toast.success for success message or toast.error for error message
        toast.success(dataa.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });

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
      setLoad(false);
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
      setLoad(true);
      try {
        const response = await fetch("http://89.232.186.173:8088/api/unsub", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: JSON.stringify({ mobile: data.mobile, lang: "en-US", channel: "SYSTEM" }),
        });

        const dataa = await response.json();

        success('true');
        // Use toast.success for success message or toast.error for error message
        toast.success(dataa.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
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
      setLoad(false);
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
                <TableCell align="center">Mobile</TableCell>
                <TableCell align="center">OTP</TableCell>
                <TableCell align="center">Operator</TableCell>
                <TableCell align="center">Subscribed</TableCell>
                <TableCell align="center">Renewal engine</TableCell>
                <TableCell align="center">Game IQ</TableCell>
                <TableCell align="center">Games Played</TableCell>
                <TableCell align="center">Games Allowed</TableCell>
                <TableCell align="center">Collected Points</TableCell>
                <TableCell align="center">Avatar</TableCell>
                <TableCell align="center">Blocked</TableCell>
                <TableCell align="center">Subscription Date</TableCell>
                <TableCell align="center">Modified</TableCell>
                <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {data ? (
                    <TableRow hover
                        key={data.id}>
                        <TableCell align="center">{data.mobile}</TableCell>
                        <TableCell align="center">{data.otp}</TableCell>
                        <TableCell align="center">{data.operator_id == 1 ? 'Uzmobile' : "Ums" }</TableCell>
                        <TableCell align="center">
                          {/* IF SUBSCRIBED => YES ELSE NO */}
                          {data.is_subscribed == 1 ? "Active" : "Not Active"}
                        </TableCell>
                        <TableCell align="center">
                        {data.is_subscription_active == 1 ? "yes" : "no"}
                      </TableCell>
                        <TableCell align="center">{data.game_iq}</TableCell>
                        <TableCell align="center">{data.played_games}</TableCell>
                        <TableCell align="center">{data.allowed_games}</TableCell>
                        <TableCell align="center">{data.collected_points}</TableCell>
                        <TableCell align="center">
                          <img width={50}
                            height={50}
                            src={'/' + data.profile_photo}
                            style={{borderRadius:'50%'}}/>
                      </TableCell>
                        <TableCell align="center">
                          {data.is_blocked === 1 ? "yes" : "no"} {/* IF BLOCKED => YES ELSE NO */}
                        </TableCell>
                        {/* DISPLAY ONLY DATE WITHOUT THE TIME*/}
                        <TableCell align="center">{data.created_at.substring(0, 19)}</TableCell>
                        <TableCell align="center">{data.updated_at.substring(0, 19)}</TableCell>
                        <TableCell>
                          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            {/* IF SUBSCRIBER NOT BLOCKED DISPLAY 'BLOCK' AND 'UNSUB' BUTTONS */}
                            {data.is_blocked == "0" ? (
                              data.is_subscribed || data.is_subscription_active ? (
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
                  disabled={load}
                >
                  {load ? (
                    <BeatLoader />
                  ): (
                    'Yes'
                  )}
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
                  disabled={load}
                >
                  {load ? (
                    <BeatLoader />
                  ): (
                    'Yes'
                  )}
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
                  disabled={load}
                >
                  {load ? (
                    <BeatLoader />
                  ): (
                    'Yes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        <ToastContainer />
      </Card>
    );
  };
