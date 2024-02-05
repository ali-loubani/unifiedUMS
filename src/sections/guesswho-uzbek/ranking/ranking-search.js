import {
    Card,
    Grid,
    MenuItem,
    Select,
  } from "@mui/material";
  
  export const RankingSearch = ({ choosenOp, operator }) => {
    return (
      <Card sx={{ p: 2 }}>
        <Grid container
        spacing={3}
        sx={{display:'flex', justifyContent:'end'}}>
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
  