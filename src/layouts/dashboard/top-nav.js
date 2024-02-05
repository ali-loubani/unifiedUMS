// **********************************    TOP NAV ITEMS   ******************************

import PropTypes from "prop-types";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import { Avatar, Box, IconButton, Stack, SvgIcon, Tooltip, useMediaQuery } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { usePopover } from "src/hooks/use-popover";
import { AccountPopover } from "./account-popover";
import Image from "next/image";
import Cookies from "js-cookie";


const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const { onNavOpen } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const accountPopover = usePopover();

  return (
    <>
      <Box
        // TOP NAV DISPLAY
        component="header"
        sx={{
          backdropFilter: "blur(6px)",
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: "sticky",
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          {/* DISPLAYING THE DRAWER ICON (3 BARS) IF THE SCREEN SIZE IF LESS THAN lg(1200px) */}
          <Stack alignItems="center"
          direction="row"
          spacing={2}>
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
            {Cookies.get('username') == 'ucell' ? (
              <Image width={80}
              height={50}
              src='/ucel.png'
              alt="" />
            ) : (
              Cookies.get('username') == 'uzmobile' ? (
                <Image width={100}
              height={80}
              src='/UzMobile-logo.png'
              alt="" />
              ) : (
                ''
              )
            )}

          </Stack>

          <Stack alignItems="center"
          direction="row"
          spacing={2}
          style={{ marginRight: "10px" }}>

            <Tooltip title="Account">
              <Avatar
                onClick={accountPopover.handleOpen}
                ref={accountPopover.anchorRef}
                sx={{
                  cursor: "pointer",
                  height: 40,
                  width: 40,
                }}
              />
            </Tooltip>

          </Stack>
        </Stack>
      </Box>

      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func,
};
