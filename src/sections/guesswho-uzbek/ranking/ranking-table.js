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
import { useState } from "react";
import { Box } from "@mui/system";
import { TbRosetteNumber1, TbRosetteNumber2, TbRosetteNumber3 } from "react-icons/tb";

export const RankingTable = ({ data, loading }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="ranking">
              <TableHead>
                <TableRow>
                  <TableCell align="center">rank</TableCell>
                  <TableCell align="center">mobile</TableCell>
                  <TableCell align="center">total points</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {data &&
                    data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          <TableRow hover
                            key={user.mobile}>
                            <TableCell align="center">
                              {actualId == 1 ? (
                                <TbRosetteNumber1 size={30}
                                    color="#FFD700" />
                              ) : actualId == 2 ? (
                                <TbRosetteNumber2 size={25}
                                    color="#C0C0C0" />
                              ) : actualId == 3 ? (
                                <TbRosetteNumber3 size={20}
                                    color="#CD7F32" />
                              ) : (
                                actualId
                              )}
                            </TableCell>
                            <TableCell align="center">{user.mobile}</TableCell>
                            <TableCell align="center">{user.total_points}</TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              )}
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, (data && data.length) > 100 && data.length]}
          component="div"
          count={(data && data.length) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
};
