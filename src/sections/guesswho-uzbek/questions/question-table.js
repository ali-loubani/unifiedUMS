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
import Image from "next/image";
import { Scrollbar } from "src/components/scrollbar";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";

export const QuestionsTable = ({ searchQuery = '' }) => {
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
      const response = await fetch("http://82.148.6.228:3000/questions");

      const jsonData = await response.json();
      setData(jsonData.questions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

const filteredData = data && data.filter((question) => {
    return (
      question.english.includes(searchQuery)
    );
  });

  return (
    <>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table id="questions">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">English</TableCell>
                  <TableCell align="center">Russian</TableCell>
                  <TableCell align="center">Uzbek</TableCell>
                  <TableCell align="center">Media</TableCell>
                  <TableCell align="center">Date</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <CircularProgress />
              ) : (
                <TableBody>
                  {filteredData &&
                    filteredData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((question) => {
                        return (
                          <TableRow hover
                          key={question.id}>
                            <TableCell align="center">{question.id}</TableCell>
                            <TableCell align="center">{question.english}</TableCell>
                            <TableCell align="center">{question.russian}</TableCell>
                            <TableCell align="center">{question.uzbek}</TableCell>
                            <TableCell align="center">
                              <img width={50}
                                height={50}
                                style={{cursor: 'pointer'}}
                                src={'http://taxmin-qil.uz/cms/media/' + question.media}
                                onClick={() => {
                                  window.open('http://taxmin-qil.uz/cms/media/' + question.media)
                                }} />
                              </TableCell>
                            <TableCell align="center">{question.inDate.substring(0, 10)}</TableCell>
                          </TableRow>
                        );
                      })}
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
    </>
  );
};
