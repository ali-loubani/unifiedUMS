// ******************************  SEARCH FIELD   ********************************

import { Card, Grid, MenuItem, Select } from "@mui/material";

export const OperatorSearch = ({ choosenOp, operator }) => (
  <Card sx={{ p: 2 }}>
    <Grid container 
      spacing={3} 
      sx={{ justifyContent: "end" }}>
      <Grid item 
        xs={12} 
        sm={3} 
        lg={3}>
        <Select
          name="operators"
          id="operators"
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
          onChange={(e) => choosenOp(e.target.value)}>
          <MenuItem value={1}>UZMOBILE</MenuItem>
          <MenuItem value={2}>UMS</MenuItem>
        </Select>
        <label style={{ marginLeft: "2%" }}>By Operator</label>
      </Grid>
    </Grid>
  </Card>
);
