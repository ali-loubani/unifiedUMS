import DeviceTabletIcon from "@heroicons/react/24/solid/DeviceTabletIcon";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  SvgIcon,
  Typography
} from "@mui/material";
import jsonexport from "jsonexport"; // Import the jsonexport library
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const iconMap = {
  // ICONS
  "ShortCode: 5501": (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
  "ShortCode: 5502": (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
  "ShortCode: 4597": (
    <SvgIcon>
      <DeviceTabletIcon />
    </SvgIcon>
  ),
};

export const ShortCode = ({ Data, sx, loading }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);

  const labels = ["ShortCode: 5501", "ShortCode: 5502", "ShortCode: 4597"];
  const series = [Data[1]?.count, Data[2]?.count, Data[0]?.count];
  const modifiedIconMap = iconMap;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const innerRadius = isSmallScreen ? "15%" : "50%";
  const outerRadius = isSmallScreen ? "35%" : "80%";

  const data = labels.map((label, index) => ({
    name: label,
    value: series[index],
  }));

  const COLORS = ["#10B981", "#F04438", "#F79009"];

  const handleExport = () => {
    const exportData = data.map((entry) => ({
      ShortCode: entry.name,
      Count: entry.value,
    }));

    jsonexport(exportData, (err, csv) => {
      if (err) {
        console.error("Error exporting data:", err);
        return;
      }

      const blob = new Blob([csv], { type: "text/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "shortcode_data.csv";
      link.click();
    });
  };

  return (
    <Card sx={sx}>
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
                height={300}>
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
                direction="column"
                spacing={2}
                sx={{ mt: 2 }}
              >
                {series.map((item, index) => {
                  const label = labels[index];
                  return (
                    <Box
                      key={label}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {modifiedIconMap[label]}
                      <Typography
                        sx={{ my: 1 }}
                        style={
                          index == 0
                            ? { color: "#10B981", fontWeight: "bold" }
                            : index === 1
                            ? { color: "#F04438", fontWeight: "bold" }
                            : { color: "#F79009", fontWeight: "bold" }
                        }
                      >
                        {label}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="subtitle2"
                        className="small-text"
                      >
                        Count:
                        <span
                          style={{
                            fontWeight: "bolder",
                            textDecoration: "underline",
                          }}
                        >
                          {item}
                        </span>
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="subtitle2"
                        className="small-text"
                      >
                        {index === 0
                          ? "Charge amount: 1999.0"
                          : index === 1
                          ? "Charge amount: 1100.0"
                          : index === 2
                          ? "Charge amount: 1499.0"
                          : ""}
                      </Typography>
                    </Box>
                  );
                })}
                <Button
                  onClick={handleExport}
                  variant="contained"
                  color="primary"
                >
                  Export Data
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      )}
    </Card>
  );
};

ShortCode.propTypes = {
  sx: PropTypes.object,
};
