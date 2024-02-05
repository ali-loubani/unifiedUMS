// ******************************  SEARCH FIELD   ********************************

import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import { Button, Card, InputAdornment, OutlinedInput, SvgIcon } from "@mui/material";
import { useState } from "react";

export const PhoneSearch = ({ choosenPhone }) => {
  const [phone, setPhone] = useState();
  const handleChangePhone = (ph) => {
    setPhone(ph);
  };
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder={"Search Phone Number"}
        onChange={(e) => handleChangePhone(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SvgIcon color="action" 
            fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        }
        sx={{ maxWidth: 500 }}
      />
      <Button
        onClick={(e) => {
          choosenPhone(phone);
        }}
        style={{ backgroundColor: "#75E6DA", color: "#000", marginLeft: "10px" }}
      >
        Search
      </Button>
    </Card>
  );
};
