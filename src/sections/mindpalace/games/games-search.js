// ******************************  SEARCH FIELD   ********************************

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

export const GamesSearch = ({ onSearch, choosenCat, category }) => (
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
          placeholder="Search Question"
          onChange={(e) => onSearch(e.target.value)}
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
          value={category}
          onChange={(e) => choosenCat(e.target.value)}
        >
          <MenuItem value="0">ALL</MenuItem>
          <MenuItem value="1">operation</MenuItem>
          <MenuItem value="2">guess the image</MenuItem>
          <MenuItem value="3">highest value</MenuItem>
          <MenuItem value="4">flip the images</MenuItem>
          <MenuItem value="5">guess the person</MenuItem>
          <MenuItem value="6">find the intruder</MenuItem>
          <MenuItem value="7">memorize the image</MenuItem>
        </Select>
        <label style={{ marginLeft: "2%" }}>By categories</label>
      </Grid>
    </Grid>
  </Card>
);
