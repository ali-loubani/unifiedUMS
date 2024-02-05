// ******************************  SIDEBAR DISPLAY  *********************************
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import {
  Box,
  Divider,
  Drawer,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  useMediaQuery,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import { SideNavItem } from "./side-nav-item";
import Image from "next/image";
import Cookies from "js-cookie";
import getConfigItems from "./config";
import { useEffect, useState } from "react";

export const SideNav = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const pathname = usePathname();
  const [country, setCountry] = useState(Cookies.get("country") ?? "uzbek");
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const [selectedService, setSelectedService] = useState(
    Cookies.get("service")
      ? Cookies.get("country") == "ksa"
        ? "guesswho"
        : Cookies.get("service")
      : "gamebay"
  );
  const [items, setItems] = useState([]);

  useEffect(() => {
    checkToken();
  }, [Cookies.get("username")]);

  const checkToken = async () => {
    try {
      const response = await fetch("http://82.148.2.56:8088/api/checkToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: "Bearer " + Cookies.get("usertoken"),
        },
      });
      const jsonData = await response.json();
      if (response.status == 401 || jsonData.username != Cookies.get("username")) {
        window.location.href = "../auth/login";
      }
    } catch (error) {
      console.log("Error");
    }
  };

  useEffect(() => {
    const updatedItems = getConfigItems(selectedService);
    setItems(updatedItems.items);
  }, [selectedService, country]);

  const handleChangeCountry = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);

    if (Cookies.get("country")) {
      Cookies.remove("country");
    }
    Cookies.set("country", newCountry);
    if (newCountry == "ksa") {
      setSelectedService("guesswho");
      router.push("/guesswho-ksa/statistics");
    }
    if (newCountry == "uzbek") {
        setSelectedService("gamebay");
        router.push("/gamebay/overview");
    }
  };

  const handleChangeService = (value) => {
    setSelectedService(value);

    if (Cookies.get("service")) {
      Cookies.remove("service");
    }
    Cookies.set("service", value);

    if (value === "gamebay") {
      router.push("/gamebay/overview");
    }
    if (value === "guesswho") {
      router.push("/guesswho-uzbek/statistics");
    }
    if (value === "mindpalace") {
      router.push("/mindpalace/overview");
    }
  };

  const content = (
    <Scrollbar
      sx={{
        height: "100%",
        "& .simplebar-content": {
          height: "100%",
        },
        "& .simplebar-scrollbar:before": {
          background: "neutral.400",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* LOGO BUTTON ON THE TOP LEFT */}
        <Box sx={{ p: 3 }}>
          <Grid container 
            alignItems="center" 
            spacing={2}>
            <Grid item>
              <Box
                sx={{
                  display: "inline-flex",
                }}
              >
                <Image src="/ara.png" 
                  alt="" 
                  width={120} 
                  height={75} />
              </Box>
            </Grid>
            {Cookies.get("username") == "admin" && (
              <Grid item>
                <Select value={country} 
                  onChange={handleChangeCountry} 
                  style={{ color: "white" }}>
                  <MenuItem value="uzbek">Uzbek</MenuItem>
                  <MenuItem value="ksa">KSA</MenuItem>
                </Select>
              </Grid>
            )}
            <Grid item>
              {Cookies.get("country") == "uzbek" || Cookies.get("country") == null ? (
                <Tabs
                  value={selectedService}
                  onChange={(e, newValue) => handleChangeService(newValue)}
                  textColor="inherit"
                  indicatorColor="primary"
                >
                  <Tab value="gamebay" 
                    label="GameBay" />
                  <Tab value="guesswho" 
                    label="GuessWho" />
                  <Tab value="mindpalace" 
                    label="MindPalace" />
                </Tabs>
              ) : (
                <Tabs
                  value={selectedService}
                  onChange={(e, newValue) => handleChangeService(newValue)}
                  textColor="inherit"
                  indicatorColor="primary"
                >
                  <Tab value="guesswho" 
                    label="GuessWho" />
                </Tabs>
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "neutral.700" }} />

        {/* ITEMS COMPONENT */}
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
            }}
          >
            {/* DISPLAYING EACH ITEM EXISTING IN THE CONFIG.JS FILE */}
            {items.map((item) => {
              let active1 = false;
              const active = item.path ? pathname === item.path : false;
              if (item.subItems && pathname === item.path) {
                active1 = true;
              } else {
                active1 = false;
              }

              return (
                <SideNavItem
                  active={active}
                  active1={active1}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                  subItems={item.subItems} // Pass the subItems to the SideNavItem component
                />
              );
            })}
          </Stack>
        </Box>
        <Divider sx={{ borderColor: "neutral.700" }} />
      </Box>
    </Scrollbar>
  );

  // IF SCREEN WIDTH BIGGER THAN 'lg'(1200px) DISPLAY THE ITEMS
  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.800",
            color: "common.white",
            width: 295,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }
  // IF SCREEN WIDTH SMALLER THAN 'lg'(1200px) DISPLAY THE ITEMS IN A DRAWER WITH AN OPEN/CLOSE CLICK
  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.800",
          color: "common.white",
          width: 295,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
