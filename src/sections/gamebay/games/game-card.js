// *******************************    GAME TABLE     ******************************

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
import {GoTriangleUp, GoTriangleDown} from 'react-icons/go';
import { Scrollbar } from "src/components/scrollbar";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CgRadioChecked } from 'react-icons/cg';
import { CgRadioCheck } from 'react-icons/cg';

export const GameCard = ({ searchQuery, choosenCat, message, data, loading }) => {
  // TAKING SEARCH AS PROPS
  const [editGame, setEditGame] = useState(false);
  const [activateGame, setActivateGame] = useState(false);
  const [deactivateGame, setDeactivateGame] = useState(false);
  const [game, setGame] = useState([]);
  const [id, setId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [sortingOrder, setSortingOrder] = useState("asc");

  useEffect(() => {
  setFilteredData(
    data &&
    data.filter((game) => {
      return (
        game.category
        &&
        (game.category.category.toLowerCase().includes(searchQuery.toLowerCase())
         || game.title.toLowerCase().includes(searchQuery.toLowerCase()))
          &&
        (game.category_id == choosenCat || choosenCat == 0)
      );
    }));
  },[data,searchQuery, choosenCat]);

  const handleSort = () => {
    const newSortingOrder = sortingOrder === "asc" ? "desc" : "asc";
    setSortingOrder(newSortingOrder);

    const sortedData = [...filteredData].sort((a, b) => {
      if (newSortingOrder === "asc") {
        return a.click_count - b.click_count;
      } else {
        return b.click_count - a.click_count;
      }
    });

    setFilteredData(sortedData);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // open edit game model
  const Edit = (e, item) => {
    e.preventDefault();
    setEditGame(true);
    setGame(item);
  };

  const handleActivate = (e, id) => {
    e.preventDefault();
    setActivateGame(true);
    setId(id);
  }

  const ActivateGame = async () => {
    try {
      const response = await fetch("http://82.148.2.56:8088/api/activateGame/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });
      const jsonData = await response.json();
      if(response.status == 200) {
        toast.success(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
      message('done');
      }
      else {
        toast.error(jsonData.message, {
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
    } finally {
      setActivateGame(false);
    }
  }

  const handleDeactivate = (e, id) => {
    e.preventDefault();
    setDeactivateGame(true);
    setId(id);
  }

  const DeactivateGame = async () => {
    try {
      const response = await fetch("http://82.148.2.56:8088/api/deactivateGame/" + id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });
      const jsonData = await response.json();
      if(response.status == 200) {
        toast.success(jsonData.message, {
        position: "bottom-right",
         autoClose: 3000,
        hideProgressBar: true,
        className: "custom-toast-success",
      });
      message('done');
      }
      else {
        toast.error(jsonData.message, {
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
    } finally {
      setDeactivateGame(false);
    }
  }

  // edit game elements
  const handleChange = (propertyName, value) => {
    setGame((prevGame) => ({
      ...prevGame,
      [propertyName]: value,
    }));
  };

  // submit edit game api
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://82.148.2.56:8088/api/editGame/${game.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify(game),
      });

      const jsonData = await response.json();
      if (jsonData.message === "success") {
        toast.success(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
        setEditGame(false);
        message('done');
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
          if (item.id === game.id) {
            return { ...item, ...game };
          }
          return item;
        })
      );
      setEditGame(false); // close edit game model
      message('done');
    } catch (error) {
      console.log("Error connecting to API: ", error);
    }
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
          <Table id="game">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">description</TableCell>
                <TableCell align="center">keywords</TableCell>
                <TableCell align="center">rating</TableCell>
                <TableCell align="center">image</TableCell>
                <TableCell align="center">url</TableCell>
                <TableCell align="center" >Date</TableCell>
                  <TableCell align="center"
                   onClick={handleSort}>
                    Click count
                    {sortingOrder === "asc" ? <GoTriangleUp /> : <GoTriangleDown />}
                    </TableCell>
                  <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress/>
            ) : (
              <TableBody>
              {filteredData && // if data exists
                filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((game, index) => {
                    const actualId = page * rowsPerPage + index + 1;
                    return (
                      <TableRow hover
                      key={game.id}>
                        <TableCell align="center">{actualId}</TableCell>
                        <TableCell align="center">
                          {game.category && game.category.category}
                        </TableCell>
                        <TableCell align="center">{game.title}</TableCell>
                        <TableCell align="center">
                          {game.description && game.description.length > 20
                            ? game.description.substring(0, 20) + "..."
                            : game.description}
                        </TableCell>
                        <TableCell align="center">
                          {game.keywords && 
                            game.keywords.map((keyword) => (
                              <div key={keyword.id}>{keyword.keyword}</div>
                            ))}
                        </TableCell>
                        <TableCell align="center">{game.rating}</TableCell>
                        <TableCell align="center">
                        <img
                          width={50}
                          height={50}
                          style={{cursor:'pointer'}}
                          src={"http://82.148.2.56:8088" + game.image}
                          alt={game.image}
                          onClick={() => {
                            window.open("http://82.148.2.56:8088" + game.image)
                          }} />
                        </TableCell>
                        <TableCell align="center">
                          <a
                            href={"http://82.148.2.56:8088" + game.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {game.url &&
                              ("http://82.148.2.56:8088" + game.url).substring(0, 10) + "..."}
                          </a>
                        </TableCell>
                        <TableCell align="center">{game.created_at.substring(0, 10)}</TableCell>
                            <TableCell align="center">{game.click_count}</TableCell>
                            <TableCell align="center">
                              {game.is_active == 1 ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Tooltip title='Edit'>
                                    <IconButton onClick={(e) => Edit(e, game)} >
                                      <SvgIcon fontSize="small">
                                        <AiFillEdit color = "#6366F1" />
                                      </SvgIcon>
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title='Deactivate'>
                                      <IconButton onClick={(e) => handleDeactivate(e, game.id)} >
                                        <SvgIcon fontSize="small">
                                          <CgRadioChecked color = "green" />
                                        </SvgIcon>
                                      </IconButton>
                                    </Tooltip>
                            </div>
                            ) : (
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Tooltip title='Edit'>
                                <IconButton onClick={(e) => Edit(e, game)} >
                                  <SvgIcon fontSize="small">
                                    <AiFillEdit color = "#6366F1" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            <Tooltip title='Activate'>
                                <IconButton onClick={(e) => handleActivate(e, game.id)} >
                                  <SvgIcon fontSize="small">
                                    <CgRadioCheck color = "red" />
                                  </SvgIcon>
                                </IconButton>
                              </Tooltip>
                            </div>
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
        rowsPerPageOptions={[10, 25, 50,(filteredData && filteredData.length) > 50 && filteredData.length]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={activateGame}
      onClose={() => setActivateGame(false)}
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
              Are you sure you want to Activate this game?
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
                onClick={() => setActivateGame(false)}
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
                onClick={() => ActivateGame()} // Call delete API
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal open={deactivateGame}
      onClose={() => setDeactivateGame(false)}
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
              Are you sure you want to Deactivate this game?
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
                onClick={() => setDeactivateGame(false)}
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
                onClick={() => DeactivateGame()} // Call delete API
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={editGame}
      onClose={() => setEditGame(false)}
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
            <p
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "1rem",
                fontSize: "1.2rem",
                color: "#333",
              }}
            >
              Edit Game Settings
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
                      Title:
                    </td>
                    <td>
                      <input
                        type="text"
                        value={game.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "0.5rem",
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
                      Description:
                    </td>
                    <td>
                      <textarea
                        value={game.description}
                        onChange={(e) => handleChange("description", e.target.value)}
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
                      }}
                    >
                      Russian Description:
                    </td>
                    <td>
                      <textarea
                        value={game.description_second_lang}
                        onChange={(e) => handleChange("description_second_lang", e.target.value)}
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
                      }}
                    >
                      Rating:
                    </td>
                    <td>
                      <input
                        type="tel"
                        value={game.rating}
                        onChange={(e) => handleChange("rating", e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "0.5rem",
                          outline: "none",
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2"
                    style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => setEditGame(false)}
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
