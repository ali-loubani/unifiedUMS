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

  export const SubscriptionTable = ({ dateFrom, dateTo, loading, data }) => {
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

      setFilteredData
       (
      data && data.filter((subscription) => {
        const subscriptionDate = new Date(subscription.created_at).toISOString().split("T")[0];
        return !dateFrom || !dateTo || (subscriptionDate >= dateFrom && subscriptionDate <= dateTo);
      }).sort((a, b) => {
        return a.created_at.localeCompare(b.created_at);
      })
    );
    },[data, dateFrom, dateTo])

    const handleSort = () => {
      const newSortingOrder = sortingOrder === "asc" ? "desc" : "asc";
      setSortingOrder(newSortingOrder);
          setFilteredData(filteredData.reverse());

    };

    return (
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="history">
              <TableHead>
                <TableRow>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">Subscription Type</TableCell>
                  <TableCell align="center">Channel</TableCell>
                  <TableCell align="center">Campaign</TableCell>
                  <TableCell
                  align="center"
                  onClick={handleSort}
                >
                  Date
                  {sortingOrder === "asc" ? <GoTriangleUp /> : <GoTriangleDown />}

                </TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
                  {filteredData && filteredData.length > 0 ? (
                    filteredData
                    .reverse()
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((subscription, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          // DISPLAYING EACH DATA FOR EACH SUBSCRIBER
                          <TableRow hover
                          key={subscription.id}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">
                              {subscription.subscription_type == 1
                                ? "SUBSCRIBE"
                                : subscription.subscription_type == 2
                                ? "RENEW"
                                : subscription.subscription_type == 3
                                ? "DEACTIVATE"
                                : subscription.subscription_type == 4
                                ? "UNKNOWN"
                                : subscription.subscription_type == 5
                                ? "REGISTER"
                                : subscription.subscription_type == 6
                                ? "UNSUCCESS"
                                : subscription.subscription_type == 0
                                ? "UNSUBSCRIBE"
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              {subscription.channel_id == 1
                                ? "APP"
                                : subscription.channel_id == 2
                                ? "PORTAL"
                                : subscription.channel_id == 3
                                ? "LANDING PAGE"
                                : subscription.channel_id == 4
                                ? "SYSTEM"
                                : subscription.channel_id == 5
                                ? "FORCE LANDING"
                                : subscription.channel_id == 6
                                ? "EXTERNAL"
                                : subscription.channel_id == 7
                                ? "WEB"
                                : subscription.channel_id == 0
                                ? "SMS"
                                : ""}
                            </TableCell>
                            <TableCell align="center">{subscription.campaign_id}</TableCell>
                            {/* DISPLAY ONLY DATE WITHOUT THE TIME*/}
                            <TableCell align="center">
                              {subscription.created_at.substring(0, 19)}
                            </TableCell>
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
