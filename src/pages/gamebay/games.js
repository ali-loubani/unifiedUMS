// *********************************      MAIN PAGE       *************************************

import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { Box, Button, Container, Grid, MenuItem, Modal, Select, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useEffect, useState } from "react";
import { GamesSearch } from "src/sections/gamebay/games/games-search";
import { GameCard } from "src/sections/gamebay/games/game-card";
import * as XLSX from "xlsx";
import { GameStat } from "../../sections/gamebay/games/game-stat";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { MoonLoader } from "react-spinners";

const now = new Date();

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [addGame, setAddGame] = useState(false);
  const [addGame1, setAddGame1] = useState(false);
  const [game, setGame] = useState({});
  const [id, setId] = useState();
  const [keywords, setKeywords] = useState();
  const [russianKeywords, setRussianKeywords] = useState();
  const [category, setCategory] = useState("0");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    checkToken();
  }, [searchQuery, category]);

  const checkToken = async () => {

    if (Cookies.get("username") != "admin") {
      window.location.href = "../auth/login"
    }

    try {
      const response = await fetch('http://82.148.2.56:8088/api/checkToken', {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        }
      });
      const jsonData = await response.json();
      if (response.status == 401 || jsonData.username != Cookies.get('username') ) {
        window.location.href = '../auth/login'
      }
      else {
        setLoadingPage(false);
      }

    } catch (error) {
      console.log('Error');
    }
  }


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

  // SAVING KEYWORD IN KEYWORD USE STATE
  const handleAddKeyword = (value) => {
    setKeywords(value);
  };

  // SAVING KEYWORD_ARABIC IN KEYWORD_ARABIC USE STATE
  const handleAddRussianKeyword = (value) => {
    setRussianKeywords(value);
  };

  useEffect(()=> {
    fetchData();
  },[])

  const fetchData = async () => {
      try {
        const response = await fetch("http://82.148.2.56:8088/api/games", {
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

  useEffect(() => {
    if (message === "done") {
      // Fetch data again when the message is "success"
      fetchData();
      setMessage('');
    }
  }, [message]);


  // ADD GAME API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://82.148.2.56:8088/api/addGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify(game),
      });

      const jsonData = await response.json();
      if (jsonData.message == "success") {
        setAddGame(false); // CLOSE 1ST STEP MODEL
        setAddGame1(true); // OPEN 2ND STEP MODEL
        setId(jsonData.game.id); // SAVING THE GAME ID TO USE IT IN ADD KEYWORD API
      } else {
        toast.error(jsonData.message, {
          position: "bottom-right",
           autoClose: 3000,
          hideProgressBar: true,
          className: "custom-toast-success",
        });
      }
    } catch (error) {
      console.log("Error connecting to API: ", error);
    }
  };

  // ADD KEYWORDS API
  const handleAddKeywords = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://82.148.2.56:8088/api/addKeyword/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
        body: JSON.stringify({ keyword: keywords, keyword_second_lang: russianKeywords }),
      });

      const jsonData = await response.json();
      setAddGame1(false); // CLOSE ADD GAME MODEL
      if (jsonData.message === "success") {
        fetchData();
        setAddGame1(false);
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
    }
  };

  // EDIT GAME ELEMENTS
  const handleChange = (propertyName, value) => {
    if (propertyName == "category") {
      setGame((prevGame) => ({
        ...prevGame,
        category_id: value,
      }));
    }
    setGame((prevGame) => ({
      ...prevGame,
      [propertyName]: value,
    }));
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <MoonLoader color="blue" />
    </div>
    ) : (
      <>
      <Head>
        <title>Games | Game Bay</title>
      </Head>
      {/* CHECKING USERTOKEN IF NOT AVAILABLE REDIRECT TO LOGIN PAGE */}
      {Cookies.get("usertoken") ? (
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
                    loading={loading}/>

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
                    Add New Game
                  </Button>
                </Grid>
              
              <GameCard // CALLING GAME CARD FILE
                data={data}
                message={handleMessage}
                loading={loading}
                searchQuery={searchQuery}
                choosenCat={category} // PASSING THE SEARCH FIELD VALUE AND CATEGORY CHOOSEN TO GAMECARD FILE
              />
            </Stack>
          </Container>
        </Box>
      ) : (
        <div>{(window.location.href = "../auth/login")}</div> // REDIRECTING TO LOGIN PAGE (NO USERTOKEN)
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
              Add New Game
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
                      Category:
                    </td>
                    <td>
                    <Select
                      id="categories"
                      style={{
                        backgroundColor: "#fff",
                        color: "#000",
                        border: "1px solid #ccc",
                        borderRadius: "0.5rem",
                        outline: "none",
                      }}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      <MenuItem value={0}></MenuItem>
                      <MenuItem value={1}>Premium</MenuItem>
                      <MenuItem value={2}>Action</MenuItem>
                      <MenuItem value={3}>Strategy</MenuItem>
                      <MenuItem value={4}>Sports</MenuItem>
                      <MenuItem value={5}>Kids</MenuItem>
                      <MenuItem value={6}>Casual</MenuItem>
                      <MenuItem value={7}>Racing</MenuItem>
                    </Select>
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
                      <input
                        type="text"
                        onChange={(e) => handleChange("description", e.target.value)}
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
                      Description_Russian:
                    </td>
                    <td>
                      <input
                        type="text"
                        onChange={(e) => handleChange("description_second_lang", e.target.value)}
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
                      Rating:
                    </td>
                    <td>
                      <input
                        type="tel"
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
                        onClick={() => setAddGame(false)}
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
                        Next
                      </Button>
                    </td>
                  </tr>
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
                          border: "1px solid #ccc",
                          borderRadius: "0.5rem",
                          outline: "none",
                        }}
                        onChange={(e) => handleAddKeyword(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr
                    style={{
                      paddingTop: "1rem",
                      paddingBottom: "1rem",
                      "@media (minWidth: 640px)": { paddingTop: "2rem", paddingBottom: "2rem" },
                    }}
                  >
                    <td style={{ paddingRight: "1rem" }}>Russian Keywords:</td>
                    <td>
                      <input
                        type="text"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "0.5rem",
                          outline: "none",
                        }}
                        onChange={(e) => handleAddRussianKeyword(e.target.value)}
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
