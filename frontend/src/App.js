import React, { Fragment, useState, useEffect } from "react";
import { useSubscription, useMutation } from "@apollo/client";
import { Chip, Grid, Paper, IconButton, TextField, Button } from "@mui/material";
import { PlayCircleFilledWhite, PauseCircle } from "@mui/icons-material";
import Lists from "./components/Lists";
import { USER_SUBSCRIPTION, SUB, ADD_USER, GET_USERS } from "./model";

const WSubscription = () => {
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

const CreateUser = () => {
  const [data, setData] = useState({ name: "", email: "" });
  const [addUser] = useMutation(ADD_USER);
  useSubscription(USER_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { userCreated } = subscriptionData.data;
      const dataInStore = client.readQuery({ query: GET_USERS });
      client.writeQuery({
        query: GET_USERS,
        data: {
          ...dataInStore,
          allUsers: [...dataInStore.allUsers, userCreated],
        },
      });
    },
  });
  const onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      ...data,
      posts: [
        {
          title: "Hello World",
          content: "This is a post",
        },
      ],
    };
    addUser({ variables: { data: newUser } }).then((e) => {
      setData({ name: "", email: "" });
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <TextField
            id="form-Nombre"
            label="Nombre"
            variant="outlined"
            size="small"
            fullWidth
            value={data.name}
            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="form-Email"
            label="Email"
            variant="outlined"
            size="small"
            fullWidth
            value={data.email}
            onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <Button color="success" variant="contained" fullWidth type="submit">
            Enviar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
function App() {
  return (
    <Fragment>
      <h1>Query</h1>
      <Lists />
      <Grid container spacing={2} p={2}>
        <Grid item xs={3}>
          <CreateUser />
        </Grid>
      </Grid>
      <h1>Subscription</h1>
      <WSubscription />
    </Fragment>
  );
}

export default App;
