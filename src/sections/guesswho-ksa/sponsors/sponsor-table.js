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

  export const SponsorsTable = () => {
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
        const response = await fetch("http://guesswhoservice.com/api/sponsors.php");

        const jsonData = await response.json();
        setData(jsonData.sponsors);
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
              <Table id="sponsors">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">id</TableCell>
                    <TableCell align="center">name</TableCell>
                    <TableCell align="center">Callback</TableCell>
                    <TableCell align="center">Direct Notify</TableCell>
                    <TableCell align="center">Date</TableCell>
                  </TableRow>
                </TableHead>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <TableBody>
                    {data &&
                      data
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((sponsor) => {
                          return (
                            <TableRow hover
                            key={sponsor.id}>
                              <TableCell align="center">{sponsor.id}</TableCell>
                              <TableCell align="center">{sponsor.name}</TableCell>
                              <TableCell align="center">{sponsor.callback_url}</TableCell>
                              <TableCell align="center">{sponsor.direct_notify}</TableCell>
                              <TableCell align="center">{sponsor.inDate.substring(0, 10)}</TableCell>
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
