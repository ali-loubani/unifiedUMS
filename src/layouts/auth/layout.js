// *************************  BLUE BACKGROUND LOGINPAGE WITH ARA LOGO ***********************

import PropTypes from "prop-types";
import { Box, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import Image from "next/image";

export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flex: "1 1 auto",
      }}
    >
      <Grid container 
        sx={{ flex: "1 1 auto" }}>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            alignItems: "center",
            background: "radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            "& img": {
              maxWidth: "100%",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
            }}
          >
            <Typography
              align="center"
              color="#15B79E"
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                mb: 1,
              }}
              variant="h1"
            >
              Welcome
            </Typography>

            <Image
              alt="ARA Technologies"
              src="/ara.png"
              width={200}
              height={100} // Set the appropriate height based on your image aspect ratio
              loading="eager" // Use 'loading' attribute for priority loading
              priority
            />
            <Typography align="center" 
              sx={{ mb: 3, color: "inherit" }} 
              variant="subtitle1">
              OUR SERVICES:
            </Typography>
            <Grid container 
              spacing={2} 
              alignItems="center" 
              alignContent="center">
              <Grid item>
                <Image
                  alt="Game Bay"
                  width={220}
                  height={30}
                  src="/igromania.png"
                  loading="eager" // Use 'loading' attribute for priority loading
                  priority
                  style={{ marginTop: "9px" }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h3">
                  GUESS
                  <span style={{ color: "#15B79E" }}> WHO</span>
                </Typography>
              </Grid>
            </Grid>
            <Image
              alt="Mind Palace"
              src="/mind-palace.png"
              width={200}
              height={100} // Set the appropriate height based on your image aspect ratio
              loading="eager" // Use 'loading' attribute for priority loading
              priority
              style={{ marginTop: "20px" }}
            />
          </Box>
        </Grid>
        {/* THE LOGIN DISPLAY (TO THE RIGHT) */}
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            backgroundColor: "background.paper",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {children}
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node,
};
