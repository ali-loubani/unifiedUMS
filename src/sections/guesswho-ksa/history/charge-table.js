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
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";

export const ChargesTable = ({ dateFrom, dateTo, data, loading }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sortingOrder, setSortingOrder] = useState("asc");
  const [filteredData, setFilteredData] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const sortedData = data && data.slice().filter((charge) => {
      const chargeDate = new Date(charge.inDate).toISOString().split("T")[0];
      return !dateFrom || !dateTo || (chargeDate >= dateFrom && chargeDate <= dateTo);
    });

    if (sortingOrder === "asc") {
      sortedData && sortedData.sort((a, b) => a.inDate.substring(0, 10).localeCompare(b.inDate.substring(0, 10)));
    } else {
      sortedData && sortedData.sort((a, b) => b.inDate.substring(0, 10).localeCompare(a.inDate.substring(0, 10)));
    }

    setFilteredData(sortedData);
  }, [data, dateFrom, dateTo, sortingOrder]);

  const handleSort = () => {
    const newSortingOrder = sortingOrder === "asc" ? "desc" : "asc";
    setSortingOrder(newSortingOrder);
  };

  const totalChargeAmount = filteredData
    ? filteredData.reduce((total, charge) => total + parseInt(charge.charge), 0)
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
                <TableCell align="center">Short Code</TableCell>
                <TableCell align="center" 
                  onClick={handleSort}>
                  Date
                  {sortingOrder === "asc" ? <GoTriangleUp /> : <GoTriangleDown />}
                </TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <TableBody>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData
                    .reverse()
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((charge, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          <TableRow hover 
                            key={charge.id}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">{charge.mobile}</TableCell>
                            <TableCell align="center">{charge.charge}</TableCell>
                            <TableCell align="center">{charge.operatorCode}</TableCell>
                            <TableCell align="center">{charge.inDate.substring(0, 19)}</TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} 
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
                    <TableCell align="center" 
                      sx={{ fontWeight: "bold", fontSize: "15px" }}>
                      Total Charge
                    </TableCell>
                    <TableCell align="center" 
                      sx={{ fontWeight: "bold", fontSize: "15px" }}>
                      {totalChargeAmount} SAR
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </>
            )}
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100, (filteredData && filteredData.length) > 100 && Number(filteredData.length)]}
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
