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

export const ConversionsSearch = ({ onSearch, choosenCallBack, callback }) => {
  return (
    <Card sx={{ p: 2 }}>
      <Grid
        container
        spacing={3}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Grid item 
          xs={12} 
          sm={9} 
          lg={9}>
          <OutlinedInput
            defaultValue=""
            fullWidth
            placeholder="Search campaign id"
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
            value={callback}
            onChange={(e) => choosenCallBack(e.target.value)}
          >
            <MenuItem value="2">All</MenuItem>
            <MenuItem value="0">0</MenuItem>
            <MenuItem value="1">1</MenuItem>
          </Select>
          <label style={{ marginLeft: "2%" }}>Callbacks</label>
        </Grid>
      </Grid>
    </Card>
  );
};
