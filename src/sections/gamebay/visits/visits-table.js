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
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { Scrollbar } from "src/components/scrollbar";

export const VisitsTable = ({
  data,
  loading,
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
        data?.filter((visit) => {
          let campaign_id = true;
          if (searchQuery) {
            campaign_id = visit.campaign_id?.includes(searchQuery);
          }

          return campaign_id;
        })
    );
  }, [data, searchQuery]);

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="visits">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">campaign id</TableCell>
                  <TableCell align="center">visit id</TableCell>
                  <TableCell align="center">google cid</TableCell>
                  <TableCell align="center">ip</TableCell>
                  <TableCell align="center">is HE</TableCell>
                  <TableCell align="center">utm_campaign</TableCell>
                  <TableCell align="center">utm_source</TableCell>
                  <TableCell align="center">placement</TableCell>
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((visit, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          <TableRow hover key={visit.id}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">
                              {visit.campaign_id}
                            </TableCell>
                            <TableCell align="center">
                              {visit.visit_id}
                            </TableCell>
                            <TableCell align="center">
                              {visit.google_cid}
                            </TableCell>
                            <TableCell align="center">{visit.ip}</TableCell>
                            <TableCell align="center">{visit.is_he}</TableCell>
                            <TableCell align="center">
                              {visit.utm_campaign}
                            </TableCell>
                            <TableCell align="center">
                              {visit.utm_source}
                            </TableCell>
                            <TableCell align="center">
                              {visit.placement}
                            </TableCell>
                            <TableCell align="center">
                              {visit.created_at.substr(0, 19)}
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
