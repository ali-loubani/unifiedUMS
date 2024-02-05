import {
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
import { useEffect, useState } from "react";
import { Box } from "@mui/system";

export const DailyTable = ({ data, loading, dateFrom, dateTo }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setFilteredData(
      data &&
        data?.filter((daily) => {
          let createdAtDate = null;

          if (daily.totalSubs?.Date != null) {
            createdAtDate = new Date(daily.totalSubs?.Date);
          } else if (daily.charging?.Date != null) {
            createdAtDate = new Date(daily.charging?.Date);
          } else if (daily.charged?.Date != null) {
            createdAtDate = new Date(daily.charged?.Date);
          }

          let dateInRange = true;

          if (dateFrom !== "") {
            dateInRange = createdAtDate >= new Date(dateFrom);
          }

          if (dateTo !== "") {
            dateInRange = createdAtDate <= new Date(dateTo);
          }

          return dateInRange;
        })
    );
  }, [data]);

  const totalSubs = filteredData
    ? filteredData.reduce((total, daily) => total + parseInt(daily.totalSubs?.SubCount ?? 0), 0)
    : 0;

  const totalCharged = filteredData
    ? filteredData.reduce((total, daily) => total + parseInt(daily.charged?.charged ?? 0), 0)
    : 0;

  const totalCharges = filteredData
    ? filteredData.reduce((total, daily) => total + parseInt(daily.charging?.chargeAmount ?? 0), 0)
    : 0;

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="daily-statistics">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Subscribers</TableCell>
                  <TableCell align="center">Active Subs</TableCell>
                  <TableCell align="center">Total Charged</TableCell>
                  <TableCell align="center">Total Charge</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
                  {filteredData &&
                    filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((daily, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          <TableRow hover 
                            key={"dd-" + index}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">
                              {daily.totalSubs?.Date ?? daily.charged.Date ?? daily.charging.Date}
                            </TableCell>
                            <TableCell align="center">{daily.totalSubs?.SubCount ?? 0}</TableCell>
                            <TableCell align="center">{daily.activeSubs ?? 0}</TableCell>
                            <TableCell align="center">{daily.charged?.charged ?? 0}</TableCell>
                            <TableCell align="center">
                              {daily.charging?.chargeAmount ?? 0} UZS
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  <TableRow>
                    <TableCell align="center" 
                      style={{ fontWeight: "bold" }}>
                      Total
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" 
                      style={{ fontWeight: "bold" }}>
                      {totalSubs?.toLocaleString()} sub
                    </TableCell>
                    <TableCell align="center" 
                      style={{ fontWeight: "bold" }}></TableCell>
                    <TableCell align="center" 
                      style={{ fontWeight: "bold" }}>
                      {totalCharged.toLocaleString()}
                    </TableCell>
                    <TableCell align="center" 
                      style={{ fontWeight: "bold" }}>
                      {totalCharges.toLocaleString()} UZS
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[
            10,
            25,
            50,
            100,
            (filteredData && filteredData.length) > 100 && Number(filteredData.length),
          ]}
          component="div"
          count={Number(filteredData && filteredData.length) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
};
