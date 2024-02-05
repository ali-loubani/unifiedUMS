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
  
  
  export const AchievementTable = ({ searchQuery = "", data, loading, message }) => {
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [editModal, setEditModal] = useState(false);
    const [achievement, setAchievement] = useState({});
    const [load, setLoad] = useState(false);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
  
    const filteredData = data?.filter((achievement) => {
      return (
        (achievement.title_uzbek.toString().includes(searchQuery)) ||
        (achievement.title_russian.toString().includes(searchQuery))
      ) ;
    });
  
    const Edit = (e, item) => {
      e.preventDefault();
      setEditModal(true);
      setAchievement(item);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const {image, ...newachievement} = achievement;
        setLoad(true);
        const response = await fetch("http://89.232.186.173:8088/api/updateAchievement/" + achievement.id, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: JSON.stringify(newachievement),
        });
        const jsonData = await response.json();
        if (jsonData.message == "success") {
          setAchievement(null);
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
      setAchievement((prevAchievement) => ({
        ...prevAchievement,
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
              <Table id="achievements">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">id</TableCell>
                    <TableCell align="center">Game ID</TableCell>
                    <TableCell align="center">Difficulty ID</TableCell>
                    <TableCell align="center">Title Russian</TableCell>
                    <TableCell align="center">Title Uzbek</TableCell>
                    <TableCell align="center">Games To Achieve</TableCell>
                    <TableCell align="center">Rewarded Points</TableCell>
                    <TableCell align="center">Photo</TableCell>
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
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((achievement, index) => {
                          return (
                            <TableRow hover 
                              key={achievement.id}>
                              <TableCell align="center">{achievement.id}</TableCell>
                              <TableCell align="center">{achievement.game_id}</TableCell>
                              <TableCell align="center">{achievement.difficulty_id}</TableCell>
                              <TableCell align="center">{achievement.title_russian}</TableCell>
                              <TableCell align="center">{achievement.title_uzbek}</TableCell>
                              <TableCell align="center">{achievement.games_to_achieve}</TableCell>
                              <TableCell align="center">{achievement.rewarded_points}</TableCell>
                              <TableCell align="center">
                                <img
                                    width={50}
                                    height={50}
                                    alt={achievement.image}    
                                    src={`http://89.232.186.173:8088/storage/achievements_photos/` + achievement.image}>
                                    </img>
                              </TableCell>
                              <TableCell align="center">
                                {achievement.created_at.substring(0, 10)}
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
                                    <IconButton onClick={(e) => Edit(e, achievement)}>
                                      <SvgIcon fontSize="small">
                                        <AiFillEdit color="#6366F1" />
                                      </SvgIcon>
                                    </IconButton>
                                  </Tooltip>
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
            rowsPerPageOptions={[
              10,
              25,
              50,
              100,
              (filteredData && filteredData.length) > 100 && filteredData.length,
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
                  Edit Achievement
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
                          Game ID:
                        </td>
                        <td>
                        <RadioGroup
                            name="type"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flex: 1,
                            }}
                            value={achievement?.game_id}
                            onChange={(e) => handleChange("game_id", e.target.value)}
                          >
                            <FormControlLabel value={"1"} 
                              control={<Radio />} 
                              label="Logic" />
                            <FormControlLabel value={"2"} 
                              control={<Radio />} 
                              label="Memory" />
                          </RadioGroup>
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
                          Difficulty:
                        </td>
                        <td>
                        <RadioGroup
                                name="difficulty"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  flex: 1,
                                }}
                                value={achievement?.difficulty_id}
                                onChange={(e) => handleChange("difficulty_id", e.target.value)}
                              >
                                <FormControlLabel value={1} 
                                  control={<Radio />} 
                                  label="Easy" />
                                <FormControlLabel
                                  value={2}
                                  control={<Radio />}
                                  label="Hard"
                                />
                              </RadioGroup>
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
                          Title Uzbek:
                        </td>
                        <td>
                          <input
                            type="text"
                            value={achievement?.title_uzbek}
                            onChange={(e) => handleChange("title_uzbek", e.target.value)}
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
                          Title Russian:
                        </td>
                        <td>
                          <input
                            type="text"
                            value={achievement?.title_russian}
                            onChange={(e) => handleChange("title_russian", e.target.value)}
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
                          Rewarded Points:
                        </td>
                        <td>
                          <input
                            type="number"
                            value={achievement?.rewarded_points}
                            onChange={(e) => handleChange("rewarded_points", e.target.value)}
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
                          Games To Achieve:
                        </td>
                        <td>
                          <input
                            type="number"
                            value={achievement?.games_to_achieve}
                            onChange={(e) => handleChange("games_to_achieve", e.target.value)}
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
  