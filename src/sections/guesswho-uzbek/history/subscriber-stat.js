//  *******************************     SUBSCRIBERS TABLE     *************************************

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
  import { toast, ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  export const SubscriberStat = ({ data, loading }) => {
    const [isUnsubOpen, setUnsubOpen] = useState(false);

    // UNSUB API
    const unSub = async (e) => {
      e.preventDefault();
      setUnsubOpen(true);
    };

    const handleConfirmUnsub = async () => {
        try {
          const response = await fetch("http://82.148.6.228:8084/api/v1/unsubscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({ msisdn: '998' + data.mobile, lang: "en-US", channel: 'WEB'  }),
          });
    
          const data = await response.json();
    
          // Use toast.success for success message or toast.error for error message
          toast.success(data.message, {
            position: "bottom-right",
             autoClose: 3000,
            hideProgressBar: true,
            className: "custom-toast-success",
          });
          message("done");
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
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Mobile</TableCell>
                <TableCell align="center">OTP</TableCell>
                <TableCell align="center">Operator</TableCell>
                <TableCell align="center">Campaign</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Deactive Date</TableCell>
                <TableCell align="center">Blocked</TableCell>
                <TableCell align="center">questions Allowed</TableCell>
                <TableCell align="center">total Points</TableCell>
                <TableCell align="center">totalCharge</TableCell>
                <TableCell align="center">Send Request</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
              </TableHead>
              {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {data && data.length > 0 ? (
                    <TableRow hover 
                    key={data.id}>
                    <TableCell align="center">{data[0].id}</TableCell>
                    <TableCell align="center">{data[0].registerDate}</TableCell>
                    <TableCell align="center">{data[0].mobile}</TableCell>
                    <TableCell align="center">{data[0].mobileVerif}</TableCell>
                    <TableCell align="center">
                      {data[0].operatorId == 1
                        ? "Uzmobile"
                        : data[0].operatorId == 2
                        ? "UMS"
                        : ""}
                    </TableCell>
                    <TableCell align="center">
                      {data[0].campaignId == 4
                        ? "S1"
                        : data[0].campaignId == 10
                        ? "Hendrick"
                        : data[0].campaignId == 9
                        ? "Mobile Arts"
                        : data[0].campaignId == 11
                        ? "Mobivert"
                        : "Not Found"}
                    </TableCell>
                    <TableCell align="center">
                      {data[0].active == "1" ? "yes" : "no"}
                    </TableCell>
                    <TableCell align="center">{data[0].deactiveDate ? data[0].deactiveDate : "NULL"}</TableCell>
                    <TableCell align="center">
                      {data[0].blocked == 1 ? "yes" : "no"}
                    </TableCell>
                    <TableCell align="center">{data[0].questionAllowed ? data[0].questionAllowed : 'NULL'}</TableCell>
                    <TableCell align="center">{data[0].totalPoints}</TableCell>
                    <TableCell align="center">{data[0].totalCharge ? data[0].totalCharge : 0}</TableCell>
                    <TableCell align="center">{data[0].sendRequestDate}</TableCell>

                    <TableCell>
                      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        {data[0].active == "1" ? (
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
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                    <TableRow>
                    <TableCell colSpan={12}
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

        <ToastContainer />
      </Card>
    );
  };
