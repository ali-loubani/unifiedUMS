//  *********************************     SUBSCRIBERS TABLE     ***************************************

import {
    Box,
    Card,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
  } from "@mui/material";
  import { Scrollbar } from "src/components/scrollbar";
  import React, { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";


  export const SmsTable = ({ dateFrom, dateTo, data, loading }) => {
    // TAKING DATE AND SEARCH AS PROPS
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
      const sortedData = data && data.slice().filter((sms) => {
        const smsDate = new Date(sms.created_at).toISOString().split("T")[0];
        return !dateFrom || !dateTo || (smsDate >= dateFrom && smsDate <= dateTo);
      });

      if (sortingOrder === "asc") {
        sortedData && sortedData.sort((a, b) => a.created_at.localeCompare(b.created_at));
      } else {
        sortedData && sortedData.sort((a, b) => b.created_at.localeCompare(a.created_at));
      }

      setFilteredData(sortedData);
    }, [data, dateFrom, dateTo, sortingOrder]);

    const handleSort = () => {
      const newSortingOrder = sortingOrder === "asc" ? "desc" : "asc";
      setSortingOrder(newSortingOrder);
    };

    return (

      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="sms">
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">Message</TableCell>
                  <TableCell align="center">From Number</TableCell>
                  <TableCell align="center">tO nUMBER</TableCell>
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
                <TableBody>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((sms, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          // DISPLAYING EACH DATA FOR EACH SUBSCRIBER
                          <TableRow hover
                          key={sms.id}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">{sms.message}</TableCell>
                            <TableCell align="center">{sms.from_number}</TableCell>
                            <TableCell align="center">{sms.to_number}</TableCell>
                            <TableCell align="center">{sms.created_at}</TableCell>
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
              )}
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, (filteredData && filteredData.length) > 100 && filteredData.length]}
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
