import React, { Fragment, useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";
import { Chip, Grid, Paper, IconButton } from "@mui/material";
import { PlayCircleFilledWhite, PauseCircle } from "@mui/icons-material";
import { SUB } from "../../model";

const TrueorFalse = () => {
  const [truths, setTruths] = useState([]);
  const [stop, setStop] = useState(true);
  const { data, loading, error } = useSubscription(SUB, { skip: stop });
  useEffect(() => {
    if (data) {
      setTruths((prev) => [...prev, data.truths]);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <Fragment>
      <IconButton color={stop ? "success" : "error"} onClick={() => setStop((prev) => !prev)}>
        {stop ? <PlayCircleFilledWhite /> : <PauseCircle />}
      </IconButton>
      <Paper elevation={3} style={{ maxHeight: 300, overflow: "auto" }}>
        <Grid container spacing={2} p={2}>
          {truths.map((truth, index) => {
            return (
              <Grid item xs={1} key={index} textAlign="center">
                <Chip label={truth ? "OK" : "FAIL"} color={truth ? "success" : "error"} />
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Fragment>
  );
};

export default TrueorFalse;
