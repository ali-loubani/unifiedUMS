// *******************************    GAME TABLE     ******************************

import {
  Box,
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
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Scrollbar } from "src/components/scrollbar";

export const GameCard = ({ searchQuery, choosenCat, message, data, media, loading }) => {
  // TAKING SEARCH AS PROPS
  const [editGame, setEditGame] = useState(false);
  const [game, setGame] = useState([]);
  const [id, setId] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [subloading, setSubloading] = useState(false);
  const [newImage, setNewImage] = useState(false);
  const [title, setTitle] = useState("");
  const [operation, setOperation] = useState({
    operand1: 0,
    operand2: 0,
    operation: "",
    operation_answer: 0,
  })

  useEffect(() => {
    setFilteredData(
      data?.filter((question) => {
        return (
          question &&
          (question.question_uzbek.toLowerCase().includes(searchQuery.toLowerCase()) ||
            question.question_russian.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (question.type_id == choosenCat || choosenCat == 0)
        );
      })
    );
  }, [data, searchQuery, choosenCat]);

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
    if (item.type_id == 1) {
      setOperation({
        operand1: JSON.parse(item.operation).operand1,
        operand2: JSON.parse(item.operation).operand2,
        operation: JSON.parse(item.operation).operation,
        operation_answer: JSON.parse(item.operation).answer,
       });
    }
  };

  const smallEdit = (e, item, imageID, imageTitle) => {
    e.preventDefault();
    setEditGame(true);
    setGame(item);
    setId(imageID);
    setTitle(imageTitle);
  };

  // edit game elements
  const handleChange = (propertyName, value) => {
    setGame((prevGame) => ({
      ...prevGame,
      [propertyName]: value,
    }));
    if (propertyName == "image") {
      setNewImage(true);
    }
    if (propertyName == "title") {
      setTitle(value);
    }
    if (propertyName == "operand1" || 
      propertyName == "operand2" ||
      propertyName == "operation" ||
      propertyName == "operation_answer" ) {
        setOperation((prevOperation) => ({
          ...prevOperation,
          [propertyName]: value,
        }));
    }
  };

  // submit edit game api
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubloading(true);

    if (newImage) {
      const formData = new FormData();
      if (game?.type_id == 4) {
        const newgame = {
          id: id,
          image: game?.image,
          points: game?.points,
        };
        Object.entries(newgame).forEach(([key, value]) => {
          formData.append(key, value);
        });
      } else if (game?.type_id == 5) {
        const newgame = {
          id: id,
          image: game?.image,
          title: game?.title,
          points: game?.points,
        };
        Object.entries(newgame).forEach(([key, value]) => {
          formData.append(key, value);
        });
      } else if (game?.type_id == 7) {
        const newgame = {
          id: id,
          image: game?.image,
          question_uzbek: game?.question_uzbek,
          question_russian: game?.question_russian,
          points: game?.points,
        };
        Object.entries(newgame).forEach(([key, value]) => {
          formData.append(key, value);
        });
      } else {
        Object.entries(game).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      setSubloading(true);
      try {
        const response = await fetch(`http://89.232.186.173:8088/api/updateQuestion/${game.id}`, {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: formData,
        });

        const jsonData = await response.json();
        if (jsonData.message === "success") {
          toast.success(jsonData.message, {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            className: "custom-toast-success",
          });
          message("done");
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
        setSubloading(false);
        setEditGame(false); // close edit game model
        setNewImage(false);
        setGame(null);
      }

    } else {
      const newquestion = {};
      if (game?.type_id == 4) {
        newquestion["id"] = id;
        newquestion["points"] = game?.points;
      } else if (game?.type_id == 5 || game?.type_id == 6) {
        newquestion["id"] = id;
        newquestion["title"] = title;
        newquestion["points"] = game?.points;
      } else if (game?.type_id == 7) {
        newquestion["id"] = id;
        newquestion["question_uzbek"] = game?.question_uzbek;
        newquestion["question_russian"] = game?.question_russian;
        newquestion["points"] = game?.points;
      } else if (game?.type_id == 1) {
        newquestion['question_uzbek'] = "quyidagi tenglamani yeching";
        newquestion['question_russian'] = "решите следующее уравнение";
        newquestion['operand1'] = operation.operand1;
        newquestion['operand2'] = operation.operand2;
        newquestion['operation'] = operation.operation;
        newquestion['operation_answer'] = operation.operation_answer;
        newquestion["points"] = game?.points;
      } else {
        const { image, ...newProps } = game;
        Object.assign(newquestion, newProps);
      }
        try {
          const response = await fetch(`http://89.232.186.173:8088/api/updateQuestion/${game.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: "Bearer " + Cookies.get("mindtoken"),
            },
            body: JSON.stringify(newquestion),
          });

          const jsonData = await response.json();
          if (jsonData.message === "success") {
            toast.success(jsonData.message, {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              className: "custom-toast-success",
            });
            message("done");
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
          setSubloading(false);
          setEditGame(false); // close edit game model
          setGame(null);
        }
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
                <TableCell align="center">Question ID</TableCell>
                <TableCell align="center">game id</TableCell>
                <TableCell align="center">Difficulty id</TableCell>
                <TableCell align="center">Type id</TableCell>
                <TableCell align="center">Question Uzbek</TableCell>
                <TableCell align="center">Question Russian</TableCell>
                <TableCell align="center">Operation</TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Points</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {filteredData && // if data exists
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((question) => {
                      // const actualId = page * rowsPerPage + index + 1;
                      // const image = media.find((img) => img.question_id === question.id);
                      return question.media.length > 0 ? (
                        question.media.map((image) => (
                          <TableRow hover 
                            key={"qm-" + image.id}>
                            <TableCell align="center">{question.id}</TableCell>
                            <TableCell align="center">{question.game_id}</TableCell>
                            <TableCell align="center">{question.difficulty_id}</TableCell>
                            <TableCell align="center">{question.type_id}</TableCell>
                            <TableCell align="center">{question.question_uzbek}</TableCell>
                            <TableCell align="center">{question.question_russian}</TableCell>
                            <TableCell
                              align="center"
                              style={!question.operation ? { opacity: "50%" } : { opacity: "100%" }}
                            >
                              {question.operation
                                ? question.operation.substring(1, question.operation.length - 1)
                                : "NO operation"}
                            </TableCell>
                            <TableCell
                              align="center"
                              style={!image?.title ? { opacity: "50%" } : { opacity: "100%" }}
                            >
                              {image?.title ? image?.title : "NO title"}
                            </TableCell>
                            <TableCell align="center">
                              <img
                                width={50}
                                height={50}
                                src={
                                  question.type_id == 4
                                    ? "http://89.232.186.173:8088/storage/flip_the_image/" +
                                      image.image
                                    : question.type_id == 5
                                    ? "http://89.232.186.173:8088/storage/guess_the_person/" +
                                      image.image
                                    : "/nopicture.jpg"
                                }
                                alt={question.image}
                              />
                            </TableCell>
                            <TableCell align="center">{question.points}</TableCell>
                            <TableCell align="center">
                              {question.created_at.substring(0, 10)}
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
                                  <IconButton
                                    onClick={(e) => smallEdit(e, question, image.id, image.title)}
                                  >
                                    <SvgIcon fontSize="small">
                                      <AiFillEdit color="#6366F1" />
                                    </SvgIcon>
                                  </IconButton>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow hover 
                          key={"qi-" + question.id}>
                          <TableCell align="center">{question.id}</TableCell>
                          <TableCell align="center">{question.game_id}</TableCell>
                          <TableCell align="center">{question.difficulty_id}</TableCell>
                          <TableCell align="center">{question.type_id}</TableCell>
                          <TableCell align="center">{question.question_uzbek}</TableCell>
                          <TableCell align="center">{question.question_russian}</TableCell>
                          <TableCell
                            align="center"
                            style={!question.operation ? { opacity: "50%" } : { opacity: "100%" }}
                          >
                            {question.operation
                              ? question.operation.substring(1, question.operation.length - 1)
                              : "NO operation"}
                          </TableCell>
                          <TableCell
                            align="center"
                            style={!media?.title ? { opacity: "50%" } : { opacity: "100%" }}
                          >
                            No Title
                          </TableCell>
                          <TableCell align="center">
                            <img
                              width={50}
                              height={50}
                              src={
                                question.type_id == 2
                                  ? "http://89.232.186.173:8088/storage/guess_the_image/" +
                                    question.image
                                  : question.type_id == 7
                                  ? "http://89.232.186.173:8088/storage/memorize_the_image/" +
                                    question.image
                                  : "/nopicture.jpg"
                              }
                              alt={question.image}
                            />
                          </TableCell>
                          <TableCell align="center">{question.points}</TableCell>
                          <TableCell align="center">
                            {question.created_at.substring(0, 10)}
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
                                <IconButton onClick={(e) => Edit(e, question)}>
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
          Number((filteredData && filteredData.length) > 50 && filteredData.length),
        ]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
              Edit Question
            </p>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <table style={{ width: "100%", margin: "0 auto" }}>
                <tbody>
                  {game?.operation && (
                    <>
                      <tr>
                        <td
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            lineHeight: "1.5rem",
                            color: "#555",
                          }}
                        >
                          Operand1:
                        </td>
                        <td>
                          <input
                            type="number"
                            value={operation.operand1}
                            onChange={(e) => handleChange("operand1", e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #ccc",
                              borderRadius: "0.5rem",
                              outline: "none",
                            }}
                          />
                        </td>
                        <td
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                            lineHeight: "1.5rem",
                            color: "#555",
                          }}
                        >
                          Operand2:
                        </td>
                        <td>
                          <input
                            type="number"
                            value={operation.operand2}
                            onChange={(e) => handleChange("operand2", e.target.value)}
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
                        <td>Operation:</td>
                        <td>
                          <RadioGroup
                            name="type"
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              flex: 1,
                            }}
                            value={operation.operation}
                            onChange={(e) => handleChange("operation", e.target.value)}
                          >
                            <FormControlLabel value={"+"} 
                              control={<Radio />} 
                              label="+" />
                            <FormControlLabel value={"-"} 
                              control={<Radio />} 
                              label="-" />
                            <FormControlLabel value={"x"} 
                              control={<Radio />} 
                              label="*" />
                            <FormControlLabel value={"/"} 
                              control={<Radio />} 
                              label="/" />
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
                          Answer:
                        </td>
                        <td>
                          <input
                            type="number"
                            value={operation.operation_answer}
                            onChange={(e) => handleChange("operation_answer", e.target.value)}
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
                    </>
                  )}
                  {game?.type_id == 4 ? (
                    <>
                      <tr>
                        <td>Image:</td>
                        <td>
                          <input
                            type="file"
                            onChange={(e) => handleChange("image", e.target.files[0])}
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              outline: "none",
                            }}
                          />
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {game?.type_id !== 1 && game?.type_id !== 3 && game?.type_id !== 6 && (
                        <>
                          <tr>
                            <td>Image:</td>
                            <td>
                              <input
                                type="file"
                                onChange={(e) => handleChange("image", e.target.files[0])}
                                style={{
                                  width: "100%",
                                  padding: "0.5rem",
                                  outline: "none",
                                }}
                              />
                            </td>
                          </tr>
                          <tr>
                            {(game?.type_id == 2 || game?.type_id == 7) && (
                              <>
                                <td
                                  style={{
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    lineHeight: "1.5rem",
                                    color: "#555",
                                  }}
                                >
                                  Question Uzbek:
                                </td>
                                <td>
                                  <input
                                    type="tel"
                                    value={game?.question_uzbek}
                                    onChange={(e) => handleChange("question_uzbek", e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #ccc",
                                      borderRadius: "0.5rem",
                                      outline: "none",
                                    }}
                                  />
                                </td>
                                <td
                                  style={{
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    lineHeight: "1.5rem",
                                    color: "#555",
                                  }}
                                >
                                  Question Russian:
                                </td>
                                <td>
                                  <input
                                    type="tel"
                                    value={game?.question_russian}
                                    onChange={(e) =>
                                      handleChange("question_russian", e.target.value)
                                    }
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #ccc",
                                      borderRadius: "0.5rem",
                                      outline: "none",
                                    }}
                                  />
                                </td>
                              </>
                            )}
                            {game?.type_id == 5 && (
                              <>
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
                                    type="tel"
                                    value={title}
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
                              </>
                            )}
                          </tr>
                        </>
                      )}
                    </>
                  )}
                  {game?.type_id == 3 && (
                    <tr>
                      <td
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          lineHeight: "1.5rem",
                          color: "#555",
                        }}
                      >
                        Question Uzbek:
                      </td>
                      <td>
                        <input
                          type="tel"
                          value={game?.question_uzbek}
                          onChange={(e) => handleChange("question_uzbek", e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.5rem",
                            border: "1px solid #ccc",
                            borderRadius: "0.5rem",
                            outline: "none",
                          }}
                        />
                      </td>
                      <td
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          lineHeight: "1.5rem",
                          color: "#555",
                        }}
                      >
                        Question Russian:
                      </td>
                      <td>
                        <input
                          type="tel"
                          value={game?.question_russian}
                          onChange={(e) => handleChange("question_russian", e.target.value)}
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
                  )}
                  {game?.type_id == 6 && (
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
                          value={title}
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
                  )}
                  <tr>
                    <td
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                        lineHeight: "1.5rem",
                        color: "#555",
                      }}
                    >
                      Points:
                    </td>
                    <td>
                      <input
                        type="number"
                        value={game?.points}
                        onChange={(e) => handleChange("points", e.target.value)}
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
                    <td></td>
                    <td colSpan="2" 
                      style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => {
                          setEditGame(false);
                          setTitle("");
                          setNewImage(false);
                        }}
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
                        disabled={subloading}
                      >
                        {subloading ? <BeatLoader /> : "Submit"}
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
