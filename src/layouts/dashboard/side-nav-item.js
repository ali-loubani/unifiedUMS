import NextLink from "next/link";
import PropTypes from "prop-types";
import { Box, ButtonBase } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useRouter } from 'next/router';


export const SideNavItem = (props) => {
  const {
    active = false,
    active1 = false,
    disabled,
    external,
    icon,
    path,
    title,
    subItems,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const containerRef = useRef(null);
  const router = useRouter();


  const handleToggleSubItems = () => {
    if (active) {
      window.location.reload();
    } else {
      setIsOpen((prevOpen) => !prevOpen);
    }
  };

  const handleCloseSubItems = () => {
    setIsOpen(false);
    setSelectedIndex(null);
  };

  const handleSubItemClick = (index) => {
    if (active1 || selectedIndex === index) {
      router.push(subItems[index].path); // Reload the page or navigate to the path again
    } else {
      setSelectedIndex(index);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        handleCloseSubItems();
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const linkProps = path
    ? external
      ? {
          component: "a",
          href: path,
          target: "_blank",
        }
      : {
          component: NextLink,
          href: path,
        }
    : {};

  return (
    <li ref={containerRef}>
      <ButtonBase
        sx={{
          alignItems: "center",
          borderRadius: 1,
          display: "flex",
          justifyContent: "flex-start",
          pl: "16px",
          pr: "16px",
          py: "6px",
          textAlign: "left",
          width: "100%",
          ...(active && {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          }),
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
          },
          color: active || selectedIndex !== null ? "common.white" : isOpen ? "common.white" : "neutral.400",
        }}
        {...(subItems && subItems.length > 0 ? {} : linkProps)}
        onClick={handleToggleSubItems}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: "center",
              color: active || selectedIndex !== null ? "primary.main" : isOpen ? "primary.main" : "neutral.400",
              display: "inline-flex",
              justifyContent: "center",
              mr: 2,
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: active || selectedIndex !== null ? "common.white" : isOpen ? "common.white" : "neutral.400",
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "36px",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Box>
        {subItems && subItems.length > 0 &&  (
          <Box sx={{ color: isOpen ? "common.white" : "neutral.400", ml: "auto" }}>
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </Box>
        )}
      </ButtonBase>

      {isOpen && subItems && subItems.length  > 0 && (
        <ul>
          {subItems.map((subItem, index) => (
            <li key={subItem.title}>
              <ButtonBase
                component={subItem.external ? "a" : NextLink}
                href={subItem.path}
                target={subItem.external ? "_blank" : undefined}
                sx={{
                  alignItems: "center",
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  pl: "16px",
                  pr: "16px",
                  textAlign: "left",
                  width: "100%",
                  ...(active1 && {
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                  }),
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                  },
                  color: active1 || selectedIndex === index ? "common.white" : "neutral.400",
                  flexGrow: 1,
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontSize: 12,
                  fontWeight: 600,
                  lineHeight: "36px",
                  whiteSpace: "nowrap",
                }}
                onClick={() => handleSubItemClick(index)}
              >
                {subItem.title}
              </ButtonBase>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  active1: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  subItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ),
};
