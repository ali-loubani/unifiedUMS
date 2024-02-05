// // *********************************     SUBSCRIBERS SEARCH     ***************************************

import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SvgIcon,
} from "@mui/material";

export const SubscribersSearch = ({ onSearch, choosenOp, operator }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Grid container
      spacing={3}>
        <Grid item
          xs={12}
          sm={9}
          lg={9}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Search mobile"
            onChange={(e) => onSearch(e.target.value)} // PARSE THE VALUE TO THE PROPS
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
        </Grid>
          <Grid item
          xs={12}
          sm={3}
          lg={3}>
            <Select
              name="categories"
              id="categories"
              variant="outlined"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                cursor: "pointer",
                fontWeight: "bold",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
                outline: "none",
              }}
              value={operator}
              onChange={(e) => choosenOp(e.target.value)}
            >
              <MenuItem value="0">ALL</MenuItem>
              <MenuItem value="1">UZmobile</MenuItem>
              <MenuItem value="2">UMS</MenuItem>
            </Select>
            <label style={{ marginLeft: "2%" }}>By Operators</label>
          </Grid>
      </Grid>
    </Card>
  );
};
