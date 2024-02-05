//  *********************************     SUBSCRIBERS TABLE     ***************************************

import {
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Modal,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEdit } from "react-icons/ai";

export const SMSTable = ({ message, choosenOp }) => {
  const [data, setData] = useState([]);
  const [sms, setSms] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [editSms, setEditSms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);

  const handleEdit = (e, sms) => {
    e.preventDefault();
    setSms(sms);
    setEditSms(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (propertyName, value) => {
    setSms((prevSms) => ({
      ...prevSms,
      [propertyName]: value,
    }));
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

  useEffect(() => {
    if (message == 201) {
      // Fetch data again when the message is "success"
      fetchData();
    }
  }, [message]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://82.148.2.56:8088/api/smsTemplate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });

      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(
        jsonData?.filter((sms) => {
          return sms.operator_id == choosenOp;
        })
      );
      if (jsonData.message == "Unauthenticated.") {
        window.location.href = "../auth/login";
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredData(
      data?.filter((sms) => {
        return sms.operator_id == choosenOp;
      })
    );
  }, [choosenOp]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(
        `http://82.148.2.56:8088/api/editSms/${sms.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("usertoken"),
          },
          body: JSON.stringify(sms),
        }
      );

      const jsonData = await response.json();
      if (jsonData.message === "success") {
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
          className: "custom-toast-error",
        });
      }
      setData((prevData) =>
        prevData.map((item) => {
          if (item.id === sms.id) {
            return { ...item, ...sms };
          }
          return item;
        })
      );
      setEditSms(false);
      fetchData();
      setLoading(false);
    } catch (error) {
      console.log("Error connecting to API: ", error);
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table id="sms">
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">type</TableCell>
                <TableCell align="center">uzbek</TableCell>
                <TableCell align="center">russian</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
                {filteredData &&
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((sms, index) => {
                      const actualId = page * rowsPerPage + index + 1;
                      return (
                        // DISPLAYING EACH DATA FOR EACH SUBSCRIBER
                        <TableRow hover key={sms.id}>
                          <TableCell align="center">{actualId}</TableCell>
                          <TableCell align="center">
                            {sms.sms_type_id == 1
                              ? "First Subscription"
                              : sms.sms_type_id == 2
                              ? "Failed Subscription"
                              : sms.sms_type_id == 3
                              ? "Partial Subscription"
                              : sms.sms_type_id == 4
                              ? "Deactivate Subscription"
                              : sms.sms_type_id == 5
                              ? "Confirm Subscription"
                              : sms.sms_type_id == 6
                              ? "Confirm Deactivate Subscription"
                              : sms.sms_type_id == 7
                              ? "OTP"
                              : sms.sms_type_id == 8
                              ? "Daily Subscription"
                              : sms.sms_type_id == 9
                              ? "Subscription Pin"
                              : sms.sms_type_id == 10
                              ? "-"
                              : sms.sms_type_id == 11
                              ? "Not Subscribed"
                              : sms.sms_type_id == 12
                              ? "Subscription Info"
                              : sms.sms_type_id == 13
                              ? "-"
                              : sms.sms_type_id == 14
                              ? "-"
                              : sms.sms_type_id == 15
                              ? "Failed Renewal"
                              : sms.sms_type_id}
                          </TableCell>
                          <TableCell align="center">
                            {sms.sms_type_id == 10 ||
                            sms.sms_type_id == 13 ||
                            sms.sms_type_id == 14
                              ? "-"
                              : sms.uzbek}
                          </TableCell>
                          <TableCell align="center">
                            {sms.sms_type_id == 10 ||
                            sms.sms_type_id == 13 ||
                            sms.sms_type_id == 14
                              ? "-"
                              : sms.russian}
                          </TableCell>
                          <TableCell align="center">
                            {sms.sms_type_id == 10 ||
                            sms.sms_type_id == 13 ||
                            sms.sms_type_id == 14 ? (
                              ""
                            ) : (
                              <Tooltip title="Edit SMS">
                                <IconButton onClick={(e) => handleEdit(e, sms)}>
                                  <SvgIcon fontSize="small">
                                    <AiFillEdit color="#6366F1" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            )}
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        rowsPerPageOptions={[
          10,
          25,
          50,
          100,
          (filteredData && filteredData.length) > 100 &&
            Number(filteredData.length),
        ]}
        component="div"
        count={(filteredData && filteredData.length) || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Modal
        open={editSms}
        onClose={() => setEditSms(false)}
        style={modalStyles}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}>
          <div
            style={{
              borderRadius: "1rem",
              width: "90%",
              maxWidth: "600px",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}>
            <p
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#333",
              }}>
              Edit SMS
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
                        color: "#555",
                      }}>
                      Uzbek:
                    </td>
                    <td>
                      <textarea
                        value={sms.uzbek}
                        onChange={(e) => handleChange("uzbek", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "0.5rem",
                          resize: "vertical",
                          outline: "none",
                          minHeight: "100px",
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
                        color: "#555",
                      }}>
                      Russian:
                    </td>
                    <td>
                      <textarea
                        value={sms.russian}
                        onChange={(e) =>
                          handleChange("russian", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "0.5rem",
                          resize: "vertical",
                          outline: "none",
                          minHeight: "100px",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => setEditSms(false)}
                        style={{
                          backgroundColor: "#6366F1",
                          color: "#fff",
                          borderRadius: "0.5rem",
                          padding: "0.5rem 1rem",
                          fontSize: "1rem",
                          marginRight: "1rem",
                          cursor: "pointer",
                        }}>
                        Cancel
                      </Button>
                      <Button
                        onClick={(e) => handleSubmit(e)}
                        style={{
                          backgroundColor: "#6366F1",
                          color: "#fff",
                          borderRadius: "0.5rem",
                          padding: "0.5rem 1rem",
                          fontSize: "1rem",
                          cursor: "pointer",
                        }}>
                        Submit
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
