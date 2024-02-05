import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Card,
  Grid,
  InputAdornment,
  OutlinedInput,
  SvgIcon
} from "@mui/material";

export const AnswerSearch = ({ onSearch }) => {
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
            placeholder="Search answer By Question ID"
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
          </Grid>
      </Grid>
    </Card>
  );
};
