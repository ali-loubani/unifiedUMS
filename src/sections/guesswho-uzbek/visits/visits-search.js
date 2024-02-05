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

export const VisitsSearch = ({ onSearch }) => {
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
      </Grid>
    </Card>
  );
};
