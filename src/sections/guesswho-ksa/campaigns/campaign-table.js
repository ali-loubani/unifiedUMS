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

export const CampaignsTable = () => {
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
      const response = await fetch("http://guesswhoservice.com/api/campaigns.php");

      const jsonData = await response.json();
      setData(jsonData.campaigns);
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
            <Table id="campaigns">
              <TableHead>
                <TableRow>
                  <TableCell align="center">id</TableCell>
                  <TableCell align="center">Sponsor</TableCell>
                  <TableCell align="center">total visits</TableCell>
                  <TableCell align="center">total subscribers</TableCell>
                  <TableCell align="center">direct notify</TableCell>
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
                      .map((campaign) => {
                        return (
                          <TableRow hover
                            key={campaign.id}>
                            <TableCell align="center">{campaign.id}</TableCell>
                            <TableCell align="center">
                              {campaign.sponsorId == 1
                                ? "S1"
                                : campaign.sponsorId == 2
                                ? "Mobile Arts"
                                : campaign.sponsorId == 3
                                ? "Hendrick"
                                : ""}
                            </TableCell>
                            <TableCell align="center">
                              {campaign.totalVisit
                                ? parseInt(campaign.totalVisit).toLocaleString()
                                : 0}
                            </TableCell>
                            <TableCell align="center">
                              {campaign.totalSubscribe
                                ? parseInt(campaign.totalSubscribe).toLocaleString()
                                : 0}
                            </TableCell>
                            <TableCell align="center">{campaign.direct_notify}</TableCell>
                            <TableCell align="center">{campaign.inDate.substring(0, 10)}</TableCell>
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
