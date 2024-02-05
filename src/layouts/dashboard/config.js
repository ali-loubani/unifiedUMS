import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import { SvgIcon } from "@mui/material";
import Cookies from "js-cookie";
import { FaGamepad, FaSms, FaUserAlt, FaUsers } from "react-icons/fa";
import { MdOutlineCampaign, MdQuestionAnswer } from "react-icons/md";
import { AiFillQuestionCircle } from "react-icons/ai";
import { IoMdStar } from "react-icons/io";

const getConfigItems = (selectedService) => {
  let items = [];

  if (selectedService == "gamebay") {
    const subItems = [
      {
        title: "Sponsors",
        path: "/gamebay/sponsors",
      },
      {
        title: "All Campaigns",
        path: "/gamebay/campaigns",
      },
    ];

    const adminItems = [
      {
        title: "Overview",
        path: "/gamebay/overview",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Daily Statistics",
        path: "/gamebay/daily-statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscribers",
        path: "/gamebay/subscribers",
        icon: (
          <SvgIcon fontSize="small">
            <UsersIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscriber History",
        path: "/gamebay/subscriber-history",
        icon: (
          <SvgIcon fontSize="small">
            <FaUserAlt />
          </SvgIcon>
        ),
      },
      {
        title: "Games",
        path: "/gamebay/games",
        icon: (
          <SvgIcon fontSize="medium">
            <FaGamepad />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "SMS Templates",
        path: "/gamebay/sms",
        icon: (
          <SvgIcon fontSize="small">
            <FaSms />
          </SvgIcon>
        ),
      },
      {
        title: "Users",
        path: "/gamebay/users",
        icon: (
          <SvgIcon fontSize="small">
            <FaUsers />
          </SvgIcon>
        ),
      },
      {
        title: "Visits",
        path: "/gamebay/visits",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Conversions",
        path: "/gamebay/conversions",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
    ];

    const subAdminItems = [
      {
        title: "Overview",
        path: "/gamebay/overview",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Daily Statistics",
        path: "/gamebay/daily-statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "Visits",
        path: "/gamebay/visits",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Conversions",
        path: "/gamebay/conversions",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
    ];

    const username = Cookies.get("username");
    items = username === "admin" ? adminItems : subAdminItems;
  }

  if (selectedService == "guesswho" && Cookies.get("country") == "uzbek") {
    const subItems = [
      {
        title: "Sponsors",
        path: "/guesswho-uzbek/sponsors",
      },
      {
        title: "Campaigns",
        path: "/guesswho-uzbek/campaigns",
      },
    ];

    const adminItems = [
      {
        title: "Statistics",
        path: "/guesswho-uzbek/statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Daily Statistics",
        path: "/guesswho-uzbek/daily-statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscribers",
        path: "/guesswho-uzbek/subscribers",
        icon: (
          <SvgIcon fontSize="small">
            <UsersIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscriber History",
        path: "/guesswho-uzbek/subscriber-history",
        icon: (
          <SvgIcon fontSize="small">
            <FaUserAlt />
          </SvgIcon>
        ),
      },
      {
        title: "Questions",
        path: "/guesswho-uzbek/questions",
        icon: (
          <SvgIcon fontSize="small">
            <AiFillQuestionCircle />
          </SvgIcon>
        ),
      },
      {
        title: "Answers",
        path: "/guesswho-uzbek/answers",
        icon: (
          <SvgIcon fontSize="medium">
            <MdQuestionAnswer />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "Users",
        path: "/guesswho-uzbek/users",
        icon: (
          <SvgIcon fontSize="small">
            <FaUsers />
          </SvgIcon>
        ),
      },
      {
        title: "Ranking",
        path: "/guesswho-uzbek/ranking",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Visits",
        path: "/guesswho-uzbek/visits",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Conversions",
        path: "/guesswho-uzbek/conversions",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
    ];

    const subAdminItems = [
      {
        title: "Statistics",
        path: "/guesswho-uzbek/statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Daily Statistics",
        path: "/guesswho-uzbek/daily-statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "Visits",
        path: "/guesswho-uzbek/visits",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Conversions",
        path: "/guesswho-uzbek/conversions",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
    ];

    const username = Cookies.get("username");
    items = username === "admin" ? adminItems : subAdminItems;
  } else if (selectedService == "guesswho" && Cookies.get("country") == "ksa") {
    const subItems = [
      {
        title: "Sponsors",
        path: "/guesswho-ksa/sponsors",
      },
      {
        title: "Campaigns",
        path: "/guesswho-ksa/campaigns",
      },
    ];

    const defaultItems = [
      {
        title: "Statistics",
        path: "/guesswho-ksa/statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscribers",
        path: "/guesswho-ksa/subscribers",
        icon: (
          <SvgIcon fontSize="small">
            <UsersIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscriber History",
        path: "/guesswho-ksa/subscriber-history",
        icon: (
          <SvgIcon fontSize="small">
            <FaUserAlt />
          </SvgIcon>
        ),
      },
      {
        title: "Questions",
        path: "/guesswho-ksa/questions",
        icon: (
          <SvgIcon fontSize="small">
            <AiFillQuestionCircle />
          </SvgIcon>
        ),
      },
      {
        title: "Answers",
        path: "/guesswho-ksa/answers",
        icon: (
          <SvgIcon fontSize="medium">
            <MdQuestionAnswer />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "Users",
        path: "/guesswho-ksa/users",
        icon: (
          <SvgIcon fontSize="small">
            <FaUsers />
          </SvgIcon>
        ),
      },
    ];

    items = defaultItems;
  }

  if (selectedService == "mindpalace") {
    const subItems = [
      {
        title: "Sponsors",
        path: "/mindpalace/sponsors",
      },
      {
        title: "All Campaigns",
        path: "/mindpalace/campaigns",
      },
    ];

    const adminItems = [
      {
        title: "Overview",
        path: "/mindpalace/overview",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Daily Statistics",
        path: "/mindpalace/daily-statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscribers",
        path: "/mindpalace/subscribers",
        icon: (
          <SvgIcon fontSize="small">
            <UsersIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Subscriber History",
        path: "/mindpalace/subscriber-history",
        icon: (
          <SvgIcon fontSize="small">
            <FaUserAlt />
          </SvgIcon>
        ),
      },
      {
        title: "Questions",
        path: "/mindpalace/games",
        icon: (
          <SvgIcon fontSize="small">
            <AiFillQuestionCircle />
          </SvgIcon>
        ),
      },
      {
        title: "Answers",
        path: "/mindpalace/answers",
        icon: (
          <SvgIcon fontSize="small">
            <FaGamepad />
          </SvgIcon>
        ),
      },
      {
        title: "Achievements",
        path: "/mindpalace/achievements",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Users",
        path: "/mindpalace/users",
        icon: (
          <SvgIcon fontSize="small">
            <FaUsers />
          </SvgIcon>
        ),
      },
      {
        title: "SMS Templates",
        path: "/mindpalace/sms",
        icon: (
          <SvgIcon fontSize="small">
            <FaSms />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "Visits",
        path: "/mindpalace/visits",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Conversions",
        path: "/mindpalace/conversions",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
    ];

    const subAdminItems = [
      {
        title: "Overview",
        path: "/mindpalace/overview",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Daily Statistics",
        path: "/mindpalace/daily-statistics",
        icon: (
          <SvgIcon fontSize="small">
            <ChartBarIcon />
          </SvgIcon>
        ),
      },
      {
        title: "Campaigns",
        icon: (
          <SvgIcon fontSize="medium">
            <MdOutlineCampaign />
          </SvgIcon>
        ),
        subItems,
      },
      {
        title: "Visits",
        path: "/mindpalace/visits",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
      {
        title: "Conversions",
        path: "/mindpalace/conversions",
        icon: (
          <SvgIcon fontSize="small">
            <IoMdStar />
          </SvgIcon>
        ),
      },
    ];

    const username = Cookies.get("username");
    items = username === "admin" ? adminItems : subAdminItems;
  }
  return { items };
};

export default getConfigItems;
