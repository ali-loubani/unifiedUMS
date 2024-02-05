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
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { Scrollbar } from "src/components/scrollbar";

export const CampaignsTable = (props) => {
  const data = props.data;
  const loading = props.loading;
  const sponsors = props.sponsors;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [load, setLoad] = useState(false);
  const [campaign, setCampaign] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);
  const [id, setId] = useState(0);

  const handleRemove = (id) => {
    setId(id);
    setRemoveModal(true);
  };

  const handleEdit = (e, campaign) => {
    e.preventDefault();
    setCampaign(campaign);
    setEditModal(true);
  };

  const Delete = async (e) => {
    setLoad(true);
    try {
      const response = await fetch(
        "http://82.148.6.228:3000/campaigns/deleteCampaign/" + id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("usertoken"),
          },
        }
      );
      const jsonData = await response.json();
      props.message("success");
      toast.success("success", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
    } catch (error) {
      toast.error("Error connecting to API: " + error, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-error",
      });
    } finally {
      setRemoveModal(false);
      setLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);

    try {
      const response = await fetch(
        `http://82.148.6.228:3000/campaigns/editCampaign/${campaign.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("usertoken"),
          },
          body: JSON.stringify(campaign),
        }
      );

      const jsonData = await response.json();
      if (response.status == 202) {
        props.message("success");
        toast.success("success", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
      } else {
        toast.error(jsonData.Message, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-error",
        });
      }
    } catch (error) {
      console.log("Error connecting to API: ", error);
    } finally {
      setEditModal(false);
      setLoad(false);
    }
  };

  const handleChange = (propertyName, value) => {
    setCampaign((prevCampaign) => ({
      ...prevCampaign,
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
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="campaigns">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Sponsor</TableCell>
                  <TableCell align="center">total visits</TableCell>
                  <TableCell align="center">total subscribers</TableCell>
                  <TableCell align="center">direct notify</TableCell>
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((campaign) => {
                        return (
                          <TableRow hover key={campaign.id}>
                            <TableCell align="center">{campaign.id}</TableCell>
                            <TableCell align="center">
                              {sponsors[campaign.sponsorId]}
                            </TableCell>
                            <TableCell align="center">
                              {campaign.totalVisit
                                ? parseInt(campaign.totalVisit).toLocaleString()
                                : 0}
                            </TableCell>
                            <TableCell align="center">
                              {campaign.totalSubscribe
                                ? parseInt(
                                    campaign.totalSubscribe
                                  ).toLocaleString()
                                : 0}
                            </TableCell>
                            <TableCell align="center">
                              {campaign.direct_notify}
                            </TableCell>
                            <TableCell align="center">
                              {campaign.inDate.substring(0, 10)}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Edit Campaign">
                                <IconButton
                                  onClick={(e) => handleEdit(e, campaign)}
                                >
                                  <SvgIcon fontSize="small">
                                    <AiFillEdit color="#6366F1" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                              &nbsp;&nbsp;
                              <Tooltip title="Delete Campaign">
                                <IconButton
                                  onClick={(e) => handleRemove(campaign.id)}
                                >
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
          rowsPerPageOptions={[
            10,
            25,
            50,
            100,
            (data && Number(data.length)) > 100 && Number(data.length),
          ]}
          component="div"
          count={(data && data.length) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Modal
          open={editModal}
          onClose={() => setEditModal(false)}
          style={modalStyles}
        >
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
                Edit Campaign Info
              </p>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <table style={{ width: "100%", margin: "0 auto" }}>
                  <tr>
                    <td
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        lineHeight: "1.5rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          color: "#555",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Sponsor:
                      </p>
                    </td>
                    <td>
                      <RadioGroup
                        id="sponsorId"
                        value={campaign.sponsorId}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flex: 1,
                          color: "#000",
                        }}
                        onChange={(e) =>
                          handleChange("sponsorId", e.target.value)
                        }
                      >
                        {Object.entries(sponsors).map((sponsor) => (
                          <FormControlLabel
                            key={sponsor[0]}
                            value={sponsor[0]}
                            control={<Radio />}
                            label={sponsor[1]}
                          />
                        ))}
                      </RadioGroup>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          color: "#555",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Direct Notify:
                      </p>
                    </td>
                    <td>
                      <RadioGroup
                        id="direct_notify"
                        value={campaign.direct_notify}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flex: 1,
                          color: "#000",
                        }}
                        onChange={(e) =>
                          handleChange("direct_notify", e.target.value)
                        }
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="true"
                        />
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label="false"
                        />
                      </RadioGroup>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ textAlign: "right" }}>
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
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </Modal>

        <Modal
          open={removeModal}
          onClose={() => setRemoveModal(false)}
          style={modalStyles}
        >
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
              <h2
                style={{
                  marginBottom: "1rem",
                  textAlign: "center",
                  color: "#333",
                }}
              >
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
                Are you sure you want to remove this Campaign?
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
    </>
  );
};
