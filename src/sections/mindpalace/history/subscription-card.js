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

export const SubscriptionTable = ({ dateFrom, dateTo, loading, data }) => {
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

    setFilteredData
     (
    data &&
    data.subscriber &&
    data.subscriber.subscription_history.filter((subscription) => {
      const subscriptionDate = new Date(subscription.created_at).toISOString().split("T")[0];
      return !dateFrom || !dateTo || (subscriptionDate >= dateFrom && subscriptionDate <= dateTo);
    })
  );
  },[data])

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
                <TableCell align="center">Date</TableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <CircularProgress />
            ) : (
              <TableBody>
                {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
                {filteredData && filteredData.length > 0 ? (
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((subscription, index) => {
                      const actualId = page * rowsPerPage + index + 1;
                      return (
                        // DISPLAYING EACH DATA FOR EACH SUBSCRIBER
                        <TableRow hover
                        key={subscription.id}>
                          <TableCell align="center">{actualId}</TableCell>
                          <TableCell align="center">
                            {subscription.subscription_type_id == 1
                              ? "SUBSCRIBE"
                              : subscription.subscription_type_id == 2
                              ? "UNSUBSCRIBE"
                              : subscription.subscription_type_id == 3
                              ? "RENEWAL"
                              : subscription.subscription_type_id == 4
                              ? "DEACTIVATE"
                              : subscription.subscription_type_id == 5
                              ? "UNKNOWN"
                              : subscription.subscription_type_id == 6
                              ? "REGISTER"
                              : subscription.subscription_type_id == 7
                              ? "UNSUCCESS REGISTRATION"
                              : ""}
                          </TableCell>
                          <TableCell align="center">
                            {subscription.channel_id == 1
                              ? "WEB"
                              : subscription.channel_id == 2
                              ? "SMS"
                              : subscription.channel_id == 3
                              ? "LANDING PAGE"
                              : subscription.channel_id == 4
                              ? "FORCE LANDING"
                              : subscription.channel_id == 5
                              ? "SYSTEM"
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
