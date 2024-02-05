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

export const AnswersTable = ({ searchQuery = "" }) => {
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
      const response = await fetch("http://82.148.6.228:3000/answers");

      const jsonData = await response.json();
      setData(jsonData.answers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData =
    data &&
    data.filter((answer) => {
      return answer.questionId.includes(searchQuery);
    });

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="answers">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Question id</TableCell>
                  <TableCell align="center">Valid</TableCell>
                  <TableCell align="center">English</TableCell>
                  <TableCell align="center">Russian</TableCell>
                  <TableCell align="center">Uzbek</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {filteredData &&
                    filteredData
                      .sort((a, b) => {
                        return a.questionId - b.questionId;
                      })
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((answer, index) => {
                        return (
                          <TableRow hover key={answer.id}>
                            <TableCell align="center">{answer.id}</TableCell>
                            <TableCell align="center">
                              {answer.questionId}
                            </TableCell>
                            <TableCell align="center">{answer.valid}</TableCell>
                            <TableCell align="center">
                              {answer.english}
                            </TableCell>
                            <TableCell align="center">
                              {answer.russian}
                            </TableCell>
                            <TableCell align="center">{answer.uzbek}</TableCell>
                            <TableCell align="center">
                              {answer.inDate.substring(0, 10)}
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
            (filteredData && filteredData.length) > 100 && filteredData.length,
          ]}
          component="div"
          count={(filteredData && filteredData.length) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
};
