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
import copy from "copy-to-clipboard";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BsFillShieldLockFill, BsFillTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillEdit } from "react-icons/ai";


export const UsersTable = ({ message }) => {
  // TAKING DATE AND SEARCH AS PROPS
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [password, setPassword] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [removeModal, setRemoveModal] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [resetModal1, setResetModal1] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(true);


  const handleModal = (id) => {
    setId(id);
    setRemoveModal(true);
  };

  const handleEdit = (e, user) => {
    e.preventDefault();
    setUser(user);
    setEditModal(true);
  };

  const handleReset = (e, id) => {
    e.preventDefault();
    setId(id);
    setResetModal(true);
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setResetModal(false);
    Reset(e);
  };

  const Reset = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://82.148.2.56:8088/api/resetPassword/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });
      const jsonData = await response.json();
      if (jsonData.message == "success") {
        setResetModal1(true);
        setPassword(jsonData.password);
      } else {
        toast.error(jsonData, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      }
    } catch (error) {
      toast.error("Error connecting to API: " + error, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (propertyName, value) => {
    setUser((prevUser) => ({
      ...prevUser,
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
      const response = await fetch("http://82.148.2.56:8088/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });

      const jsonData = await response.json();
      setData(jsonData);
      if (jsonData.message == "Unauthenticated.") {
        window.location.href = "../auth/login"; // redirect to login page
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const Delete = async (e) => {
    setLoading(true);
    try {
      const response = await fetch("http://82.148.2.56:8088/api/deleteUser/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });
      const jsonData = await response.json();
      toast.success(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });

      fetchData();
      setRemoveModal(false);
      setLoading(false);
    } catch (error) {
      toast.error("Error connecting to API: " + error, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(`http://82.148.2.56:8088/api/editUser/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify(user),
      });

      const jsonData = await response.json();
      if (jsonData.message === "User updated successfully") {
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
          if (item.id === user.id) {
            return { ...item, ...user };
          }
          return item;
        })
      );
      setEditModal(false); // close edit game model
      fetchData();
      setLoading(false);
    } catch (error) {
      console.log("Error connecting to API: ", error);
    }
  };

  const handleCopy = () => {
    try {
      copy(password);
      toast.success("Password copied to clipboard", {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
    } catch (err) {
      toast.error("Failed to copy: " + err, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    }
  };

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table id="users">
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">username</TableCell>
                <TableCell align="center">email</TableCell>
                <TableCell align="center">Permission</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
              {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
              {data &&
                data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user, index) => {
                    const actualId = page * rowsPerPage + index + 1;
                    return (
                      // DISPLAYING EACH DATA FOR EACH SUBSCRIBER
                      <TableRow hover
                        key={user.id}>
                        <TableCell align="center">{actualId}</TableCell>
                        <TableCell align="center">{user.username}</TableCell>
                        <TableCell align="center">{user.email}</TableCell>
                        <TableCell align="center">{user.permission}</TableCell>
                        {/* DISPLAY ONLY DATE WITHOUT THE TIME*/}
                        <TableCell align="center">{user.created_at.substring(0, 10)}</TableCell>
                        <TableCell align="center">{user.updated_at.substring(0, 10)}</TableCell>
                        <TableCell align="center">
                          {user.permission !== "Admin" && (
                            <>
                              <Tooltip title='Delete User'>
                                <IconButton onClick={(e) => handleModal(user.id)} >
                                  <SvgIcon fontSize="small">
                                    <BsFillTrashFill color = "red" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                              &nbsp;&nbsp;
                              <Tooltip title='Reset Pass' >
                                <IconButton onClick={(e) => handleReset(e, user.id)} >
                                  <SvgIcon fontSize="small" >
                                    <BsFillShieldLockFill color = "black" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                              &nbsp;&nbsp;
                              <Tooltip title='Edit User' >
                                <IconButton onClick={(e) => handleEdit(e, user)} >
                                  <SvgIcon fontSize="small">
                                    <AiFillEdit color="#6366F1" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            </>
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
        rowsPerPageOptions={[10, 25, 50, 100, (data && data.length) > 100 && data.length]}
        component="div"
        count={(data && data.length) || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={removeModal}
        onClose={() => setRemoveModal(false)}
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
              maxWidth: "500px",
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
              Are you sure you want to remove this user?
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{
                  backgroundColor: "#6366F1",
                  cursor: "pointer",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  marginRight: "1rem",
                }}
                onClick={() => setRemoveModal(false)}
              >
                Cancel
              </Button>

              <Button
                style={{
                  backgroundColor: "#6366F1",
                  cursor: "pointer",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                }}
                onClick={(e) => Delete(e)} // call delete API
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </Modal>

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
              maxWidth: "500px",
              backgroundColor: "#f9f9f9",
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
                color: "#333",
              }}
            >
              Edit User Info
            </p>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#555",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Username:
              </label>
              <input
                type="text"
                value={user.username}
                onChange={(e) => handleChange("username", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#555",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Email:
              </label>
              <input
                type="text"
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
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
                style={{
                  backgroundColor: "#6366F1",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={resetModal}
        onClose={() => setResetModal(false)}
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
              maxWidth: "500px",
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
              Are you sure you want to reset the password?
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{
                  backgroundColor: "#6366F1",
                  cursor: "pointer",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  marginRight: "1rem",
                }}
                onClick={() => setResetModal(false)}
              >
                Cancel
              </Button>
              <Button
                style={{
                  backgroundColor: "#6366F1",
                  cursor: "pointer",
                  color: "#fff",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                }}
                onClick={(e) => handleConfirm(e)}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={resetModal1}
        onClose={() => setResetModal1(false)}
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
              maxWidth: "500px",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ marginBottom: "1rem", textAlign: "center", color: "#333" }}>
              Password Reset Successful
            </h3>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#555",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                New Password:
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                }}
              >
                <input
                  type="text"
                  value={password}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "none",
                    outline: "none",
                  }}
                  readOnly
                />
                <Button
                  onClick={() => handleCopy()}
                  style={{
                    backgroundColor: "#6366F1",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "0 0.5rem 0.5rem 0",
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Button
                onClick={(e) => setResetModal1(false)}
                style={{
                  backgroundColor: "#6366F1",
                  color: "#fff",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
