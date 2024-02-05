import { Scrollbar } from "src/components/scrollbar";
import {
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
import { Box } from "@mui/system";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";


export const SubscribersTable = (props) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [loadingUnsub, setLoadingUnsub] = useState(true);
  const data = props.data;
  const message = props.message;
  const searchQuery = props.searchQuery;
  const operator = props.operator;
  const loading = props.loading;
  const [_mobile, _setMobile] = useState();
  const [isUnsubOpen, setUnsubOpen] = useState(false);

  const filteredData = data.filter((subscriber) => {
    return (
      subscriber.mobile.includes(searchQuery) &&
      (subscriber.operatorId == operator || operator == 0)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const unSub = async (e, mobile) => {
    e.preventDefault();
    setUnsubOpen(true);
    _setMobile(mobile);
  };

  const handleConfirmUnsub = async (mobile) => {
    try {
      const response = await fetch("http://guesswhoservice.com:8084/api/v1/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({ msisdn: '998' + mobile, lang: "en-US", channel: 'WEB'  }),
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
    } finally {
      setLoadingUnsub(false);
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
          <Table id="subscribers">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
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
                {filteredData
                  .reverse()
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((subscriber, index) => {
                    const actualId = page * rowsPerPage + index + 1;
                    return (
                      <TableRow hover
                        key={subscriber.id}>
                        <TableCell align="center">{actualId}</TableCell>
                        <TableCell align="center">{subscriber.registerDate}</TableCell>
                        <TableCell align="center">{subscriber.mobile}</TableCell>
                        <TableCell align="center">{subscriber.mobileVerif}</TableCell>
                        <TableCell align="center">
                          {subscriber.operatorId == 1
                            ? "Mobily"
                            : subscriber.operatorId == 2
                            ? "Zain"
                            : subscriber.operatorId == 3
                            ? "Stc"
                            :""}
                        </TableCell>
                        <TableCell align="center">
                          {subscriber.campaignId == 9
                            ? "Mobile Arts"
                            : ""}
                        </TableCell>
                        <TableCell align="center">
                          {subscriber.active == 1 ? "yes" : "no"}
                        </TableCell>
                        <TableCell align="center">{subscriber.deactiveDate}</TableCell>
                        <TableCell align="center">
                          {subscriber.blocked == 1 ? "yes" : "no"}
                        </TableCell>
                        <TableCell align="center">{subscriber.questionAllowed}</TableCell>
                        <TableCell align="center">{subscriber.totalPoints}</TableCell>
                        <TableCell align="center">{subscriber.totalCharge}</TableCell>
                        <TableCell align="center">{subscriber.sendRequestDate}</TableCell>

                        <TableCell>
                          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                            {subscriber.active == "1" ? (
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
                                {loadingUnsub && subscriber.mobile == _mobile ? (
                                <BeatLoader />
                                  ) : (
                                    "Unsub"
                                  )}
                              </Button>
                            ) : (
                              <div></div>
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
        rowsPerPageOptions={[10, 25, 50, 100, (filteredData && filteredData.length) > 100 && Number(filteredData.length)]}
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
    </Card>
  );
};
