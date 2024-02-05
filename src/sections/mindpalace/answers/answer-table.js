import {
  Button,
  Card,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
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
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import { AiFillEdit } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const AnswersTable = ({ searchQuery = "", data, loading, message }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [answer, setAnswer] = useState({});
  const [load, setLoad] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filteredData = data?.filter((answer) => {
    return answer.question_id.toString().includes(searchQuery);
  });

  const Edit = (e, item) => {
    e.preventDefault();
    setEditModal(true);
    setAnswer(item);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoad(true);
      const response = await fetch("http://89.232.186.173:8088/api/updateAnswer/" + answer.id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
        body: JSON.stringify(answer),
      });
      const jsonData = await response.json();
      if (jsonData.message == "success") {
        setAnswer(null);
        message("done");
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
    } catch (error) {
      console.log("Error connecting to API: ", error);
    } finally {
      setLoad(false);
      message("done");
      setEditModal(false);
    }
  };

  const handleChange = (propertyName, value) => {
    setAnswer((prevAnswer) => ({
      ...prevAnswer,
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

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="answers">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Question id</TableCell>
                  <TableCell align="center">Valid</TableCell>
                  <TableCell align="center">Answer Russian</TableCell>
                  <TableCell align="center">Answer Uzbek</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {filteredData &&
                    filteredData
                      .sort((a, b) => {
                        return a.questionId - b.questionId;
                      })
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((answer, index) => {
                        return (
                          <TableRow hover 
                            key={answer.id}>
                            <TableCell align="center">{answer.id}</TableCell>
                            <TableCell align="center">{answer.question_id}</TableCell>
                            <TableCell align="center">{answer.is_correct}</TableCell>
                            <TableCell align="center">{answer.answer_russian}</TableCell>
                            <TableCell align="center">{answer.answer_uzbek}</TableCell>
                            <TableCell align="center">
                              {answer.created_at.substring(0, 10)}
                            </TableCell>
                            <TableCell align="center">
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Tooltip title="Edit">
                                  <IconButton onClick={(e) => Edit(e, answer)}>
                                    <SvgIcon fontSize="small">
                                      <AiFillEdit color="#6366F1" />
                                    </SvgIcon>
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </TableCell>{" "}
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
            Number((filteredData && filteredData.length) > 100 && filteredData.length),
          ]}
          component="div"
          count={(filteredData && filteredData.length) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Modal open={editModal} 
          onClose={() => setEditModal(false)} 
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
                  background: "linear-gradient(to top right, #8b5cf6, #d10a3c)",
                  padding: "20px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
              <p
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  color: "#fff",
                }}
              >
                Edit Answer
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
                        }}
                      >
                        Answer Uzbek:
                      </td>
                      <td>
                        <input
                          type="text"
                          value={answer?.answer_uzbek}
                          onChange={(e) => handleChange("answer_uzbek", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "0.5rem",
                            resize: "vertical",
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
                          color: "#555",
                        }}
                      >
                        Answer Russian:
                      </td>
                      <td>
                        <input
                          type="text"
                          value={answer?.answer_russian}
                          onChange={(e) => handleChange("answer_russian", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "0.5rem",
                            resize: "vertical",
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
                          color: "#555",
                        }}
                      >
                        Is Correct:
                      </td>
                      <td>
                        <RadioGroup
                          name="difficulty"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            flex: 1,
                          }}
                          value={answer?.is_correct}
                          onChange={(e) => handleChange("is_correct", e.target.value)}
                        >
                          <FormControlLabel value={1} 
                            control={<Radio />} 
                            label="True" />
                          <FormControlLabel value={0} 
                            control={<Radio />} 
                            label="False" />
                        </RadioGroup>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" 
                        style={{ textAlign: "right" }}>
                        <Button
                          onClick={() => setEditModal(false)}
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
                          onClick={(e) => handleSubmit(e)}
                          disabled={load}
                          style={{
                            backgroundColor: "#6366F1",
                            color: "#fff",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 1rem",
                            fontSize: "1rem",
                            cursor: "pointer",
                          }}
                        >
                          {load ? <BeatLoader /> : "Submit"}
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
      <ToastContainer />
    </>
  );
};
