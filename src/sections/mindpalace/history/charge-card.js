import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Scrollbar } from "src/components/scrollbar";
import React, { useEffect, useState } from "react";


export const ChargesTable = ({ dateFrom, dateTo, data, loading }) => {
  // TAKING DATE AND SEARCH AS PROPS
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [filteredData, setFilteredData] = useState([]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {

  setFilteredData (
    data &&
    data.subscriber &&
    data.subscriber.charges.filter((charge) => {
      const chargeDate = new Date(charge.created_at).toISOString().split("T")[0];
      return !dateFrom || !dateTo || (chargeDate >= dateFrom && chargeDate <= dateTo);
    })
  );
  },[data])

    const totalChargeAmount = filteredData
    ? filteredData.reduce((total, charge) => total + charge.charge_amount, 0)
    : 0;


  return (

    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table id="charges">
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Mobile</TableCell>
                <TableCell align="center">Charge Amount</TableCell>
                <TableCell align="center">Charging Type</TableCell>
                <TableCell align="center">Short Code</TableCell>
                <TableCell align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
              <TableBody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((charge, index) => {
                      const actualId = page * rowsPerPage + index + 1;
                      return (
                        // DISPLAYING EACH DATA FOR EACH SUBSCRIBER
                        <TableRow hover
                        key={charge.id}>
                          <TableCell align="center">{actualId}</TableCell>
                          <TableCell align="center">{charge.mobile}</TableCell>
                          <TableCell align="center">{charge.charge_amount}</TableCell>
                          <TableCell align="center">
                            {charge.charging_type_id === 1
                              ? "RENEWAL"
                              : charge.charging_type_id === 2
                              ? "SUBSCRIPTION"
                              : ""}
                          </TableCell>
                          <TableCell align="center">{charge.short_code}</TableCell>
                          {/* DISPLAY ONLY DATE WITHOUT THE TIME*/}
                          <TableCell align="center">{charge.created_at.substring(0, 19)}</TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}
                    align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
              <TableRow>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell align="center"
                  sx={{ fontWeight: "bold", fontSize: "15px" }}>
                  Total Charge
                </TableCell>
                <TableCell align="center"
                  sx={{ fontWeight: "bold", fontSize: "15px" }}>
                  {totalChargeAmount} UZS
                </TableCell>
              </TableRow>
            </TableFooter>
            </>
            )}
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100,  Number((filteredData && filteredData?.length) > 100 && filteredData.length)]}
        component="div"
        count={(filteredData && filteredData.length) || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
};
