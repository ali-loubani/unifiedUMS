// ************************************ CIRCULAR SUBSCRIBERS TYPE ***************************************
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DeviceTabletIcon from "@heroicons/react/24/solid/DeviceTabletIcon";
import { FaSms } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { GrSystem } from "react-icons/gr";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Cookies from "js-cookie";

const iconMap = {
  // ICONS
  SMS: (
    <SvgIcon>
      <FaSms />
    </SvgIcon>
  ),
  ForceLanding: (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
  LandingPage: (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),

  System: (
    <SvgIcon>
      <GrSystem />
    </SvgIcon>
  ),
  Web: (
    <SvgIcon>
      <TbWorld />
    </SvgIcon>
  ),
};

export const OverviewSubType = ({ series, labels, sx, loading }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const innerRadius = isSmallScreen ? "15%" : "50%";
  const outerRadius = isSmallScreen ? "35%" : "80%";

  // TAKING DATA AS PROPS
  const data = labels.map((label, index) => ({
    name: label,
    value: series[index],
  }));
  const modifiedIconMap = iconMap;

  const COLORS = ["#10B981", "#F04438", "#F79009", "#6366F1", "#06AED4"];

  return (
    <Card sx={sx}>
      <CardHeader title="Type of Sub" />
      {loading ? (
        <CircularProgress />
      ) : (
        <CardContent>
           <Grid container 
          spacing={2}>
          <Grid item 
            xs={12} 
            md={6}>
          <ResponsiveContainer width="100%" 
            height={isSmallScreen ? 200 : 350}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                paddingAngle={2}
                label={({ percent }) => `${(percent * 100).toFixed(2)}%`}
              >
                {/* LOOP OVER NUMBERS FOR DISPLAY IN A PIE CHART */}
                {data.map((entry, index) => (
                  <Cell key={index} 
                    fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </Grid>
          <Grid item 
            xs={12} 
            md={4}>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{ mt: 2, height:'100%' }}
          >
            {/* LOOPING OVER THE SERIES AND DISPLAY THE INFO */}
            {series.map((item, index) => {
              const label = labels[index]; // SAVING LABELS IN CONST LABEL

              return (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    // Define relative font sizes for different screen sizes
                    "& .small-text": {
                      fontSize: "0.8rem", // Adjust the font size for smaller screens
                    },
                    "& .extra-small-text": {
                      fontSize: "0.6rem", // Adjust the font size for extra small screens
                    },
                  }}
                >
                  {modifiedIconMap[label]} {/* ICON DISPLAY OF EVERY LABEL */}
                  <Typography
                    sx={{ my: 1, flexWrap:'wrap', fontSize: isSmallScreen ? '0.8rem' : '1rem'  }}
                    style={
                      index === 0
                        ? { color: "#10B981" }
                        : index === 1
                        ? { color: "#F04438" }
                        : index === 2
                        ? { color: "#F79009" }
                        : index === 3
                        ? { color: "#6366F1" }
                        : { color: "#06AED4" }
                    }
                  >
                    {label}
                  </Typography>
                  <Typography color="text.secondary" 
                    variant="subtitle2" 
                    style={{fontWeight:"bold"}}>
                    {item}
                    <span> sub</span>
                  </Typography>
                </Box>
              );
            })}
          </Stack>
          </Grid>
          </Grid>
        </CardContent>
      )}
    </Card>
  );
};

OverviewSubType.propTypes = {
  labels: PropTypes.array,
  sx: PropTypes.object,
  series: PropTypes.array,
};
