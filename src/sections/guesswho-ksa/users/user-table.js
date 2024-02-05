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

export const UsersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://guesswhoservice.com/api/systemUsers.php");

      const jsonData = await response.json();
      setData(jsonData.users);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="users">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Username</TableCell>
                  <TableCell align="center">Password</TableCell>
                  <TableCell align="center">Permission</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {/* DISPLAY DATA ACCORDING TO NUMBER OF ROWS PER PAGE */}
                  {data &&
                    data
                      .reverse()
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user, index) => {
                        const actualId = page * rowsPerPage + index + 1;
                        return (
                          <TableRow hover
                            key={user.id}>
                            <TableCell align="center">{actualId}</TableCell>
                            <TableCell align="center">{user.name}</TableCell>
                            <TableCell align="center">{user.username}</TableCell>
                            <TableCell align="center">{user.password}</TableCell>
                            <TableCell align="center">{user.permissionId}</TableCell>
                            <TableCell align="center">{user.inDate.substring(0, 10)}</TableCell>
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
