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

export const ConversionsTable = ({
  data,
  loading,
  callback,
  dateFrom,
  dateTo,
  searchQuery,
}) => {
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
        data.filter((call) => {
          const campaign_id = call.campaign_id.toString().includes(searchQuery);
          const is_callback = call.is_callback == callback || callback == "2";

          const createdAtDate = new Date(call.created_at.substr(0, 10));
          let dateInRange = true;

          if (dateFrom !== "") {
            dateInRange = createdAtDate >= new Date(dateFrom);
          }

          if (dateTo !== "") {
            dateInRange = dateInRange && createdAtDate <= new Date(dateTo);
          }

          return campaign_id && is_callback && dateInRange;
        })
    );
  }, [data, searchQuery, callback]);

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="conversions">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">campaign id</TableCell>
                  <TableCell align="center">mobile</TableCell>
                  <TableCell align="center">click id</TableCell>
                  <TableCell align="center">is callback</TableCell>
                  <TableCell align="center">notified date</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
                  {filteredData &&
                    filteredData
                      .reverse()
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((conversion, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          <TableRow hover 
                            key={conversion.id}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">
                              {conversion.campaign_id}
                            </TableCell>
                            <TableCell align="center">
                              {conversion.mobile}
                            </TableCell>
                            <TableCell align="center">
                              {conversion.click_id}
                            </TableCell>
                            <TableCell align="center">
                              {conversion.is_callback}
                            </TableCell>
                            <TableCell align="center">
                              {conversion.notified_date}
                            </TableCell>
                            <TableCell align="center">
                              {conversion.created_at.substr(0, 19)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
            (filteredData && filteredData.length) > 100 &&
              Number(filteredData.length),
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
