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
    operation: 0,
    guess_the_image: 0,
    highest_value: 0,
    flip_the_images: 0,
    guess_the_person: 0,
    find_the_intruder: 0,
    memorize_the_image: 0
  });
  const { sx } = props;

  useEffect(() => {
    handleCategories(data);
  }, [data]);


  // fill games type by category
  const handleCategories = (data) => {
    const updatedCategory = {
      operation: 0,
      guess_the_image: 0,
      highest_value: 0,
      flip_the_images: 0,
      guess_the_person: 0,
      find_the_intruder: 0,
      memorize_the_image: 0
    };

    // counting games number by categories
    data && data.forEach((question) => {
      if (question.type_id == 1) {
        updatedCategory.operation += 1;
      } else if (question.type_id == 2) {
        updatedCategory.guess_the_image += 1;
      } else if (question.type_id == 3) {
        updatedCategory.highest_value += 1;
      } else if (question.type_id == 4) {
        updatedCategory.flip_the_images += 1;
      } else if (question.type_id == 5) {
        updatedCategory.guess_the_person += 1;
      } else if (question.type_id == 6) {
        updatedCategory.find_the_intruder += 1;
      } else if (question.type_id == 7) {
        updatedCategory.memorize_the_image += 1;
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
                    Total Questions
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

      <Typography variant="h5">Total Questions By Category</Typography>
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
                          {categoryName} Questions
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
