// ***************************************    GAME STATS     ************************************

import {
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { FaGamepad } from "react-icons/fa";

export const GameStat = (props) => {
  const data = props.data;
  const loading = props.loading;
  const [category, setCategory] = useState({
    premium: 0,
    action: 0,
    strategy: 0,
    sport: 0,
    kids: 0,
    casual: 0,
    racing: 0,
  });
  const { sx } = props;

  useEffect(() => {
    handleCategories(data);
  }, [data]);


  // fill games type by category
  const handleCategories = (data) => {
    const updatedCategory = {
      premium: 0,
      action: 0,
      strategy: 0,
      sport: 0,
      kids: 0,
      casual: 0,
      racing: 0,
    };

    // counting games number by categories
    data && data.forEach((game) => {
      if (game.category_id == 1) {
        // premium game
        updatedCategory.premium += 1;
      } else if (game.category_id == 2) {
        // action game
        updatedCategory.action += 1;
      } else if (game.category_id == 3) {
        // strategy game
        updatedCategory.strategy += 1;
      } else if (game.category_id == 4) {
        // sport game
        updatedCategory.sport += 1;
      } else if (game.category_id == 5) {
        // kids game
        updatedCategory.kids += 1;
      } else if (game.category_id == 6) {
        // casual game
        updatedCategory.casual += 1;
      } else if (game.category_id == 7) {
        // racing game
        updatedCategory.racing += 1;
      }
    });

    setCategory(updatedCategory);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Card sx={sx}>
          <CardContent>
              <Stack direction="row"
              justifyContent="space-between"
              spacing={3}>
                <Stack spacing={1}>
                  <Typography color="text.secondary"
                  variant="overline">
                    Total Games
                  </Typography>
                  {loading ? ( // if no data
              <CircularProgress />
            ) : (
                  <Typography variant="h4">{data.length}</Typography>
            )}
                </Stack>
                <Avatar
                  sx={{
                    backgroundColor: "success.main",
                    height: 56,
                    width: 56,
                  }}
                >
                  <SvgIcon>
                    <FaGamepad />
                  </SvgIcon>
                </Avatar>
              </Stack>
          </CardContent>
        </Card>
      </div>

      <Typography variant="h5">Total Games By Category</Typography>
      <div style={{ display: "flex" }}>
        <Grid container
        spacing={2}>
          {/* loop over games categories */}
          {Object.entries(category).map(([categoryName, categoryValue], i) => (
            <Grid key={categoryName}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}>
              <Card sx={sx}>
                <CardContent>

                    <Stack
                      alignItems="flex-start"
                      direction="row"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Stack spacing={1}>
                        <Typography color="text.secondary"
                        variant="overline">
                          {categoryName} Games
                        </Typography>
                        {loading ? (
                    <CircularProgress />
                  ) : (
                        <Typography variant="h4">{categoryValue}</Typography>
                  )}
                      </Stack>

                      <Avatar
                        sx={{
                          backgroundColor: "error.main",
                          height: 56,
                          width: 56,
                        }}
                      >
                        <SvgIcon>
                          <FaGamepad />
                        </SvgIcon>
                      </Avatar>
                    </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </>
  );
};
