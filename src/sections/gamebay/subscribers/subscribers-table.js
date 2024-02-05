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
  TablePagination,
  TableRow,
} from "@mui/material";
import {GoTriangleUp, GoTriangleDown} from 'react-icons/go';
import { Scrollbar } from "src/components/scrollbar";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

export const SubscribersTable = ( props ) => {
  const [unsubLoading,setUnsubLoading] =useState(false);
  const [blockLoading,setBlockLoading] =useState(false);
  const [unblockLoading,setUnBlockLoading] =useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isUnsubOpen, setUnsubOpen] = useState(false);
  const [isUnblockOpen, setUnblockOpen] = useState(false);
  const [isBlockOpen, setBlockOpen] = useState(false);
  const [_mobile, _setMobile] = useState();
  const [_id, _setId] = useState();
  const data = props.data;
  const message = props.message;
  const dateFrom = props.dateFrom;
  const dateTo = props.dateTo;
  const searchQuery = props.searchQuery;
  const operator = props.operator;
  const loading = props.loading;
  const [filteredData, setFilteredData] = useState([]);
  const [sortingOrder, setSortingOrder] = useState("asc");


  useEffect(() => {
    setFilteredData(
      data &&
      data
      .filter((subscriber) => {
        const mobileMatch = subscriber.mobile.includes(searchQuery);
        const operatorMatch = subscriber.operator_id == operator || operator == 0;

        const createdAtDate = new Date(subscriber.created_at);
        let dateInRange = true;
        
        if (dateFrom !== '') {
          dateInRange = createdAtDate >= new Date(dateFrom);
        }

        if (dateTo !== '') {
          dateInRange = dateInRange && (createdAtDate <= new Date(dateTo));
        }

        return mobileMatch && operatorMatch && dateInRange;
     })
      .sort((a, b) => {
        return a.updated_at.localeCompare(b.updated_at);
      })
    )},[data,searchQuery, operator, dateFrom, dateTo]);

  const handleSort = () => {
    const newSortingOrder = sortingOrder === "asc" ? "desc" : "asc";
    setSortingOrder(newSortingOrder);
        setFilteredData(filteredData.reverse());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // BLOCK API
  const block = async (e, mobile) => {
    e.preventDefault();
    setBlockOpen(true);
    _setMobile(mobile);
  };

  const handleConfirmBlock = async (mobile) => {
    setBlockLoading(true);
    try {
      const response = await fetch("http://82.148.2.56:8088/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify({ lang: "en-US", mobile: mobile }),
      });

      const data = await response.json();

      // Use toast.success for success message or toast.error for error message
      toast.success(data.data.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
      message('done');

    } catch (error) {
      console.log("Error connecting to API: ", error);
      toast.error("Error connecting to API. Please try again later.", {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setBlockLoading(false);
      setBlockOpen(false);
    }

    // Close the modal after handling the confirmation

  };

  const handleCancelBlock = () => {
    // Close the modal if the user cancels
    setBlockOpen(false);
  };

  // UNBLOCK API
  const unblock = async (e, id) => {
    e.preventDefault();
    setUnblockOpen(true);
    _setId(id);
  };

  const handleConfirmUnblock = async (id) => {
    setUnBlockLoading(true);
    try {
      const response = await fetch("http://82.148.2.56:8088/api/unblock/" + id, {
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
      message('done');

    } catch (error) {
      console.log("Error connecting to API: ", error);
      toast.error("Error connecting to API. Please try again later.", {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setUnBlockLoading(false);
      setUnblockOpen(false);
    }

    // Close the modal after handling the confirmation

  };

  const handleCancelUnblock = () => {
    // Close the modal if the user cancels
    setUnblockOpen(false);
  };

  // UNSUB API
  const unSub = async (e, mobile) => {
    e.preventDefault();
    setUnsubOpen(true);
    _setMobile(mobile);
  };

  const handleConfirmUnsub = async (mobile) => {
    setUnsubLoading(true);
    try {
      const response = await fetch("http://82.148.2.56:8088/api/unsub", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify({ mobile: mobile, lang: "en-US" }),
      });

      const data = await response.json();

      // Use toast.success for success message or toast.error for error message
      toast.success(data.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
      message('done');

    } catch (error) {
      toast.error("Error connecting to API" + error, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setUnsubLoading(false);
      setUnsubOpen(false);
    }

    // Close the modal after handling the confirmation

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
          <Table id="subscribers">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Mobile</TableCell>
                <TableCell align="center">OTP</TableCell>
                <TableCell align="center">Operator</TableCell>
                <TableCell align="center">Subscribed</TableCell>
                <TableCell align="center">Renewal engine</TableCell>
                <TableCell align="center">Blocked</TableCell>
                <TableCell align="center" 
                  onClick={handleSort}>
                  Date
                  {sortingOrder === "asc" ? <GoTriangleUp /> : <GoTriangleDown />}
                  </TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress/>
            ) :
            (
              <TableBody>
              {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
              {filteredData
              .reverse()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((subscriber, index) => {
                  const actualId = page * rowsPerPage + index + 1;
                  return (
                    <TableRow hover
                      key={subscriber.id}>
                      <TableCell align="center">{actualId}</TableCell>
                      <TableCell align="center">{subscriber.mobile}</TableCell>
                      <TableCell align="center">{subscriber.otp}</TableCell>
                      <TableCell align="center">{subscriber.operator && subscriber.operator.name}</TableCell>
                      <TableCell align="center">
                        {subscriber.is_subscribed === 1 ? "yes" : "no"}
                      </TableCell>
                      <TableCell align="center">
                        {subscriber.is_subscription_active === 1 ? "yes" : "no"}
                      </TableCell>
                      <TableCell align="center">
                        {subscriber.is_blocked === 1 ? "yes" : "no"} {/* IF BLOCKED => YES ELSE NO */}
                      </TableCell>
                      <TableCell align="center">{subscriber.created_at.substring(0,19)}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                          {subscriber.is_blocked == "0" ? (
                            subscriber.is_subscribed ? (
                              <>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  style={{
                                    marginRight: "0.5rem",
                                    borderRadius: "0.375rem",
                                    width: "50%",
                                  }}
                                  onClick={(e) => unSub(e, subscriber.mobile)}
                                >
                                  {unsubLoading && subscriber.mobile == _mobile ?
                                  <BeatLoader />
                                :
                                'Unsub'
                                }
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  style={{
                                    borderRadius: "0.375rem",
                                    width: "50%",
                                  }}
                                  onClick={(e) => block(e, subscriber.mobile)}
                                >
                                  {blockLoading && subscriber.mobile == _mobile ?
                                  <BeatLoader />
                                :
                                'Block'
                                }
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
                                onClick={(e) => block(e, subscriber.mobile)}
                              >
                                {blockLoading && subscriber.mobile == _mobile ?
                                  <BeatLoader />
                                :
                                'Block'
                                }
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
                                onClick={(e) => unblock(e, subscriber.id)}
                              >
                                {unblockLoading && subscriber.id == _id ?
                                  <BeatLoader />
                                :
                                'Unblock'
                                }
                              </Button>
                            </div>
                          )}
                        </div>
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
        rowsPerPageOptions={[10, 50, 100, (filteredData && filteredData.length) > 100 && filteredData.length]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
                onClick={() => handleConfirmUnsub(_mobile)}
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
                onClick={() => handleConfirmUnblock(_id)}
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
                onClick={() => handleConfirmBlock(_mobile)}
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
