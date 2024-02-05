import {
  Button,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  Select,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { Scrollbar } from "src/components/scrollbar";
import "react-toastify/dist/ReactToastify.css";
import { BeatLoader } from "react-spinners";

export const SponsorTable = (props) => {
  const data = props.data;
  const loading = props.loading;
  const [load, setLoad] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sponsor, setSponsor] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [id, setId] = useState(0);

  const handleRemove = (id) => {
    setId(id);
    setRemoveModal(true);
  };

  const handleEdit = (e, sponsor) => {
    e.preventDefault();
    setSponsor(sponsor);
    setEditModal(true);
  };

  const Delete = async (e) => {
    setLoad(true);
    try {
      const response = await fetch("http://89.232.186.173:8088/api/deleteSponsor/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
      });
      const jsonData = await response.json();
      props.message('success');
      toast.success(jsonData.message, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });

      setRemoveModal(false);
    } catch (error) {
      toast.error("Error connecting to API: " + error, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const response = await fetch(`http://89.232.186.173:8088/api/editSponsor/${sponsor.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
        body: JSON.stringify(sponsor),
      });

      const jsonData = await response.json();
      if (jsonData.message === "success") {
        props.message("success");
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
      setEditModal(false); // close edit game model
    } catch (error) {
      console.log("Error connecting to API: ", error);
    } finally {
      setLoad(false);
    }
  };

  const handleChange = (propertyName, value) => {
    setSponsor((prevSponsor) => ({
      ...prevSponsor,
      [propertyName]: value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
          <Table id="sponsor">
            <TableHead>
              <TableRow>
                <TableCell align="center">id</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Direct Notify</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {data &&
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((sponsor) => {
                      return (
                        <TableRow hover 
                          key={sponsor.id}>
                          <TableCell align="center">{sponsor.id}</TableCell>
                          <TableCell align="center">{sponsor.name}</TableCell>
                          <TableCell align="center">{sponsor.direct_notify}</TableCell>
                          <TableCell align="center">
                            {sponsor.created_at.substring(0, 10)}
                          </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Edit Sponsor">
                                <IconButton onClick={(e) => handleEdit(e, sponsor)}>
                                  <SvgIcon fontSize="small">
                                    <AiFillEdit color="#6366F1" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                              &nbsp;&nbsp;
                              <Tooltip title="Delete Sponsor">
                                <IconButton onClick={(e) => handleRemove(sponsor.id)}>
                                  <SvgIcon fontSize="small">
                                    <BsFillTrashFill color="red" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
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
        rowsPerPageOptions={[10, 25, 50, 100,  Number((data && data?.length) > 100 && data.length)]}
        component="div"
        count={(data && data.length) || 0}
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
              Edit Sponsor Info
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
                Name:
              </label>
              <input
                type="text"
                value={sponsor.name}
                onChange={(e) => handleChange("name", e.target.value)}
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
                Direct Notify:
              </label>
              <Select
                id="categories"
                style={{
                  width: "25%",
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #ccc",
                  borderRadius: "0.5rem",
                  outline: "none",
                }}
                onChange={(e) => handleChange("direct_notify", e.target.value)}
              >
                <MenuItem value={1}>true</MenuItem>
                <MenuItem value={0}>false</MenuItem>
              </Select>
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
                disabled={load}
              >
                {load ? <BeatLoader /> : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

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
              Are you sure you want to remove this Sponsor?
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
                disabled={load}
              >
                {load ? <BeatLoader /> : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
