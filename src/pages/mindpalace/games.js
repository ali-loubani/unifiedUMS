// *********************************      MAIN PAGE       *************************************

import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useEffect, useState } from "react";
import { GamesSearch } from "src/sections/mindpalace/games/games-search";
import { GameCard } from "src/sections/mindpalace/games/game-card";
import * as XLSX from "xlsx";
import { GameStat } from "../../sections/mindpalace/games/game-stat";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { BeatLoader, MoonLoader } from "react-spinners";

const now = new Date();

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  // const [media, setMedia] = useState([])
  const [addGame, setAddGame] = useState(false);
  const [addGame1, setAddGame1] = useState(false);
  const [game, setGame] = useState({});
  const [id, setId] = useState();
  const [category, setCategory] = useState("0");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);
  const [nextStep, setNextStep] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    checkToken();
  }, [searchQuery, category]);

  const checkToken = async () => {

    if ((Cookies.get('username').toLowerCase() !== 'admin')) {
      window.location.href = "../auth/login"
    }
    
    try {
      const response = await fetch("http://89.232.186.173:8088/api/checkToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
        },
      });
      const jsonData = await response.json();
      if (response.status == 401) {
        window.location.href = "../auth/login";
      } else {
        setLoadingPage(false);
      }
    } catch (error) {
      console.log("Error");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleMessage = (message) => {
    setMessage(message);
  };

  // OPEN ADD GAME MODEL
  const add = (e) => {
    e.preventDefault();
    setAddGame(true);
  };

  useEffect(() => {
    fetchData();
    // fetchMedia();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://89.232.186.173:8088/api/questions", {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("mindtoken"),
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

  // const fetchMedia = async () => {
  //   try {
  //     const response = await fetch("http://89.232.186.173:8088/api/media", {
  //       headers: {
  //         "Content-Type": "application/json",
  //         accept: "application/json",
  //         Authorization: "Bearer " + Cookies.get("mindtoken"),
  //       },
  //     });
  //     const jsonData = await response.json();
  //     setMedia(jsonData);
  //     if (jsonData.message == "Unauthenticated.") {
  //       window.location.href = "../auth/login"; // redirect to login page
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (message === "done") {
      // Fetch data again when the message is "success"
      fetchData();
      // fetchMedia();
      setMessage("");
    }
  }, [message]);

  // ADD GAME API
  const handleSubmit = async (e, type_id) => {
    e.preventDefault();

    const newgame = game;

    if (type_id == 1) {
      newgame["question_uzbek"] = "quyidagi tenglamani yeching";
      newgame["question_russian"] = "решите следующее уравнение";
    }
    if (type_id == 4) {
      newgame["question_uzbek"] = "Rasmlarni moslashtiring";
      newgame["question_russian"] = "Сопоставьте изображения";
    }
    if (type_id == 5) {
      newgame["question_uzbek"] = "Bu odam kim?";
      newgame["question_russian"] = "Кто это?";
    }
    if (type_id == 6) {
      newgame["question_uzbek"] = "Buzg'unchini toping";
      newgame["question_russian"] = "Найдите злоумышленника";
    }
    if (game?.type_id == 2 || game?.type_id == 4 || game?.type_id == 5 || game?.type_id == 7) {
      const formData = new FormData();
      Object.entries(newgame).forEach(([key, value]) => {
        formData.append(key, value);
      });
      setLoading(true);
      try {
        const response = await fetch("http://89.232.186.173:8088/api/addQuestion", {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: formData,
        });
        const jsonData = await response.json();
        if (jsonData.message == "success") {
          fetchData();
          setId(jsonData.question.id); // SAVING THE GAME ID TO USE IT IN ADD KEYWORD API
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
        setLoading(false);
        setGame(null);
        setNextStep(false);
        setAddGame(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await fetch("http://89.232.186.173:8088/api/addQuestion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: "Bearer " + Cookies.get("mindtoken"),
          },
          body: JSON.stringify(newgame),
        });
        const jsonData = await response.json();
        if (jsonData.message == "success") {
          fetchData();
          setId(jsonData.question.id); // SAVING THE GAME ID TO USE IT IN ADD KEYWORD API
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
        setAddGame(false);
        setLoading(false);
        setGame(null);
        setNextStep(false);
      }
    }
  };
  // EDIT GAME ELEMENTS
  const handleChange = (propertyName, value) => {
    if ([propertyName] == "type_id") {
      if (value == 1 || value == 2 || value == 3) {
        setGame((prevGame) => ({
          ...prevGame,
          [propertyName]: value,
          game_id: 1,
        }));
      } else {
        setGame((prevGame) => ({
          ...prevGame,
          [propertyName]: value,
          game_id: 2,
        }));
      }
    } else {
      setGame((prevGame) => ({
        ...prevGame,
        [propertyName]: value,
      }));
    }
  };

  const handleExport = () => {
    const workbook = XLSX.utils.book_new();

    // Convert your table data into a worksheet
    const worksheet = XLSX.utils.table_to_sheet(document.getElementById("game"));

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook as an Excel file
    XLSX.writeFile(workbook, "games.xlsx");
  };

  const handleCategory = (cat) => {
    setCategory(cat);
  };

  return (
    <>
      {loadingPage ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <MoonLoader color="blue" />
        </div>
      ) : (
        <>
          <Head>
            <title>Games | Mind Palace</title>
          </Head>
          {/* CHECKING mindtoken IF NOT AVAILABLE REDIRECT TO LOGIN PAGE */}
          {Cookies.get("mindtoken") ? (
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                py: 8,
              }}
            >
              <Container maxWidth="xl">
                <Stack spacing={3}>
                  <Stack direction="row" 
                    justifyContent="space-between" 
                    spacing={4}>
                    <Stack spacing={1}>
                      <Typography variant="h4">Games</Typography>

                      <GameStat data={data} 
                        loading={loading} />

                      <Stack alignItems="center" 
                        direction="row" 
                        spacing={1}>
                        <Button
                          color="inherit"
                          startIcon={
                            <SvgIcon fontSize="small">
                              <ArrowDownOnSquareIcon />
                            </SvgIcon>
                          }
                          onClick={handleExport}
                        >
                          Export
                        </Button>
                      </Stack>
                    </Stack>
                  </Stack>
                  <GamesSearch
                    onSearch={handleSearch}
                    choosenCat={handleCategory} // Search Props
                    category={category}
                  />
                  {/* CALLING GAME SEARCH FILE  */}
                    <Grid container 
                      justifyContent="flex-end">
                      <Button
                        startIcon={
                          <SvgIcon fontSize="small">
                            <PlusIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        onClick={(e) => add(e)} // CALLING THE ADD FUNCTION
                      >
                        Add New Question
                      </Button>
                    </Grid>
                  <GameCard // CALLING GAME CARD FILE
                    data={data}
                    // media={media}
                    message={handleMessage}
                    loading={loading}
                    searchQuery={searchQuery}
                    choosenCat={category}
                  />
                </Stack>
              </Container>
            </Box>
          ) : (
            <div>{(window.location.href = "../auth/login")}</div> // REDIRECTING TO LOGIN PAGE (NO mindtoken)
          )}

          {/* OPEN ADD GAME MODEL AFTER PRESSING ADDGAME BUTTON */}
          <Modal open={addGame} 
            onClose={() => setAddGame(false)}>
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
                  {nextStep
                    ? game?.type_id == 1
                      ? "Operation"
                      : game?.type_id == 2
                      ? "Guess the Image"
                      : game?.type_id == 3
                      ? "Highest Value"
                      : game?.type_id == 4
                      ? "Flip the Image"
                      : game?.type_id == 5
                      ? "Guess the Person"
                      : game?.type_id == 6
                      ? "Find the Intruder"
                      : game?.type_id == 7
                      ? "Memorize the Image"
                      : "Add New Question"
                    : "Add New Question"}
                </p>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <table style={{ width: "100%", margin: "0 auto" }}>
                    <tbody>
                      {nextStep ? (
                        game?.type_id == 1 ? (
                          <>
                            <tr>
                              <td>Operand 1:</td>
                              <td>
                                <input
                                  type="number"
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
                            </tr>
                            <tr>
                              <td>Operand 2:</td>
                              <td>
                                <input
                                  type="number"
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
                              <td>Answer:</td>
                              <td>
                                <input
                                  type="number"
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
                            <tr>
                              <td>Points:</td>
                              <td>
                                <input
                                  type="number"
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
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => {
                                    handleSubmit(e, game?.type_id);
                                  }}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                  disabled={loading}
                                >
                                  {loading ? (
                                    <BeatLoader />
                                  ) : (
                                    "Add"
                                  )}
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : game?.type_id == 2 || game?.type_id == 7 ? (
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
                              <td>Question Uzbek:</td>
                              <td>
                                <input
                                  type="text"
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
                              <td>Question Russian:</td>
                              <td>
                                <input
                                  type="text"
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
                            <tr>
                              <td>Answer 1:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek1", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 1:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian1", e.target.value)}
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
                              <td>Answer 2:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek2", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 2:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian2", e.target.value)}
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
                              <td>Answer 3:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek3", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 3:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian3", e.target.value)}
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
                              <td>Answer 4:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek4", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 4:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian4", e.target.value)}
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
                              <td>Points:</td>
                              <td>
                                <input
                                  type="number"
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
                              <td></td>
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => handleSubmit(e, game?.type_id)}
                                  disabled={loading}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loading ? <BeatLoader /> : "Add"}
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : game?.type_id == 3 ? (
                          <>
                            <tr>
                              <td>Question Uzbek:</td>
                              <td>
                                <input
                                  type="text"
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
                              <td>Question Russian:</td>
                              <td>
                                <input
                                  type="text"
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
                            <tr>
                              <td>Answer 1:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek1", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 1:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian1", e.target.value)}
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
                              <td>Answer 2:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek2", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 2:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian2", e.target.value)}
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
                              <td>Answer 3:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek3", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 3:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian3", e.target.value)}
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
                              <td>Answer 4:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_uzbek4", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Answer 4:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("answer_russian4", e.target.value)}
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
                              <td>Points:</td>
                              <td>
                                <input
                                  type="number"
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
                              <td></td>
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => handleSubmit(e, game?.type_id)}
                                  disabled={loading}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loading ? <BeatLoader /> : "Add"}
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : game?.type_id == 4 ? (
                          <>
                            <tr>
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image1", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image2", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image3", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              {game.difficulty_id == 2 && (
                                <>
                                  <td>Image:</td>
                                  <td>
                                    <input
                                      type="file"
                                      onChange={(e) => handleChange("image4", e.target.files[0])}
                                      style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        outline: "none",
                                      }}
                                    />
                                  </td>
                                </>
                              )}
                            </tr>
                            <tr>
                              <td>Points:</td>
                              <td>
                                <input
                                  type="number"
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
                            <tr></tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => handleSubmit(e, game?.type_id)}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loading ? <BeatLoader /> : "Add"}
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : game?.type_id == 5 ? (
                          <>
                            <tr>
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image1", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title1", e.target.value)}
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
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image2", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title2", e.target.value)}
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
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image3", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title3", e.target.value)}
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
                              <td>Image:</td>
                              <td>
                                <input
                                  type="file"
                                  onChange={(e) => handleChange("image4", e.target.files[0])}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title4", e.target.value)}
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
                            {game.difficulty_id == 2 && (
                              <>
                                <tr>
                                  <td>Image:</td>
                                  <td>
                                    <input
                                      type="file"
                                      onChange={(e) => handleChange("image5", e.target.files[0])}
                                      style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        outline: "none",
                                      }}
                                    />
                                  </td>
                                  <td>Title:</td>
                                  <td>
                                    <input
                                      type="text"
                                      onChange={(e) => handleChange("title5", e.target.value)}
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
                                  <td>Image:</td>
                                  <td>
                                    <input
                                      type="file"
                                      onChange={(e) => handleChange("image6", e.target.files[0])}
                                      style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        outline: "none",
                                      }}
                                    />
                                  </td>
                                  <td>Title:</td>
                                  <td>
                                    <input
                                      type="text"
                                      onChange={(e) => handleChange("title6", e.target.value)}
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
                            <tr>
                              <td>Points:</td>
                              <td>
                                <input
                                  type="number"
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
                            <tr></tr>
                            <tr>
                              <td></td>
                              <td></td>
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => handleSubmit(e, game?.type_id)}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loading ? <BeatLoader /> : "Add"}
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : game?.type_id == 6 ? (
                          <>
                            <tr>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title1", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title2", e.target.value)}
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
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title3", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title4", e.target.value)}
                                  style={{
                                    width: "100%",
                                    padding: "0.5rem",
                                    border: "1px solid #ccc",
                                    borderRadius: "0.5rem",
                                    outline: "none",
                                  }}
                                />
                              </td>
                              <tr>
                              <td>Title:</td>
                              <td>
                                <input
                                  type="text"
                                  onChange={(e) => handleChange("title5", e.target.value)}
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
                            </tr>
                            {game?.difficulty_id == 2 && (
                              <tr>
                                <td>Title:</td>
                                <td>
                                  <input
                                    type="text"
                                    onChange={(e) => handleChange("title5", e.target.value)}
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem",
                                      border: "1px solid #ccc",
                                      borderRadius: "0.5rem",
                                      outline: "none",
                                    }}
                                  />
                                </td>
                                <td>Title:</td>
                                <td>
                                  <input
                                    type="text"
                                    onChange={(e) => handleChange("title6", e.target.value)}
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
                              <td>Points:</td>
                              <td>
                                <input
                                  type="number"
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
                              <td></td>
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => handleSubmit(e, game?.type_id)}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loading ? <BeatLoader /> : "Add"}
                                </Button>
                              </td>
                            </tr>
                          </>
                        ) : (
                          <>
                            <tr>
                              <td colSpan="2" 
                                style={{ textAlign: "right" }}>
                                <Button
                                  onClick={() => {
                                    setNextStep(false);
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
                                  Back
                                </Button>
                                <Button
                                  // onClick={(e) => handleSubmit(e, game?.type_id) }
                                  onClick={(e) => handleSubmit(e, game?.type_id)}
                                  style={{
                                    backgroundColor: "#6366F1",
                                    color: "#fff",
                                    borderRadius: "0.5rem",
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  {loading ? <BeatLoader /> : "Add"}
                                </Button>
                              </td>
                            </tr>
                          </>
                        )
                      ) : (
                        <>
                          <tr>
                            <td
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                lineHeight: "1.5rem",
                                color: "#fff",
                              }}
                            >
                              Type:
                            </td>
                            <td>
                              <RadioGroup
                                name="type"
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  flex: 1,
                                }}
                                value={game?.type_id ? game.type_id : null}
                                onChange={(e) => handleChange("type_id", e.target.value)}
                              >
                                <FormControlLabel value={1} 
                                  control={<Radio />} 
                                  label="Operation" />
                                <FormControlLabel
                                  value={2}
                                  control={<Radio />}
                                  label="Guess the image"
                                />
                                <FormControlLabel
                                  value={3}
                                  control={<Radio />}
                                  label="Highest value"
                                />
                                <FormControlLabel
                                  value={4}
                                  control={<Radio />}
                                  label="Flip the image"
                                />
                                <FormControlLabel
                                  value={5}
                                  control={<Radio />}
                                  label="Guess the person"
                                />
                                <FormControlLabel
                                  value={6}
                                  control={<Radio />}
                                  label="Find the intruder"
                                />
                                <FormControlLabel
                                  value={7}
                                  control={<Radio />}
                                  label="Memorize the image"
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
                                color: "#fff",
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
                                value={game?.difficulty_id ? game.difficulty_id : null}
                                onChange={(e) => handleChange("difficulty_id", e.target.value)}
                              >
                                <FormControlLabel value={1} 
                                  control={<Radio />} 
                                  label="Easy" />
                                <FormControlLabel value={2} 
                                  control={<Radio />} 
                                  label="Hard" />
                              </RadioGroup>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="2" 
                              style={{ textAlign: "right" }}>
                              <Button
                                onClick={() => {
                                  setAddGame(false);
                                  setGame(null);
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
                                // onClick={(e) => handleSubmit(e, game?.type_id) }
                                onClick={(e) => {
                                  if (game?.type_id == null || game?.difficulty_id == null) {
                                    toast.error("Please select an Option!", {
                                      position: "bottom-right",
                                      autoClose: 3000,
                                      hideProgressBar: true,
                                      className: "custom-toast-error",
                                    });
                                  } else {
                                    setNextStep(true);
                                  }
                                }}
                                style={{
                                  backgroundColor: "#6366F1",
                                  color: "#fff",
                                  borderRadius: "0.5rem",
                                  padding: "0.5rem 1rem",
                                  fontSize: "1rem",
                                  cursor: "pointer",
                                }}
                              >
                                Next
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal>

          {/* OPEN 2ND MODEL TO ADD THE KEYWORDS ELEMENTS */}
          <Modal open={addGame1} 
            onClose={() => setAddGame1(false)}>
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
                  borderRadius: "1.5rem",
                  width: "91.666667%",
                  backgroundColor: "#dddddd",
                  padding: "20px",
                  maxWidth: "600px",
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
                  Add New Game
                </p>
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <table style={{ width: "100%", margin: "0 auto" }}>
                    <tbody>
                      <tr
                        style={{
                          paddingTop: "1rem",
                          paddingBottom: "1rem",
                          "@media (minWidth: 640px)": { paddingTop: "2rem", paddingBottom: "2rem" },
                        }}
                      >
                        <td style={{ paddingRight: "1rem" }}>Keywords:</td>
                        <td>
                          <input
                            type="text"
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              border: "1px solid #000",
                              borderRadius: "0.5rem",
                              outline: "none",
                            }}
                            onChange={(e) => handleAddKeyword(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="2" 
                          style={{ textAlign: "right" }}>
                          <Button
                            onClick={() => setAddGame1(false)}
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
                            onClick={(e) => handleAddKeywords(e)}
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

          <ToastContainer />
        </>
      )}
    </>
  );
};

// CALLING THE DASHBOARD LAYOUT (SIDEBAR)
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
