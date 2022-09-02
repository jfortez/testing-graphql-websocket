import React, { useState } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import List from "../Listas/List";
import { GET_MESSAGES, MESSAGE_SUBSCRIPTION, SEND_MESSAGE } from "../../model";
import { faker } from "@faker-js/faker";
const Mensajes = () => {
  const [isPending, setIsPending] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { allMessages } = data || {};
  useSubscription(MESSAGE_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { Messages } = subscriptionData.data;
      if (Messages) {
        setIsPending(true);
      }
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const onSend = async () => {
    const fakeMessage = faker.git.commitMessage();
    await sendMessage({ variables: { data: { content: fakeMessage } } });
  };
  const onReceive = async () => {
    refetch();
    setIsPending(false);
  };
  return (
    <Grid container spacing={2} p={2}>
      <Grid item xs={12} sm={8} md={9} xl={10}>
        <List
          data={allMessages}
          secondary="content"
          title={"Mensajes"}
          showDeleteButon={false}
          height={400}
        />
      </Grid>
      <Grid item xs={12} sm={4} md={3} xl={2}>
        <Stack direction="column" spacing={2} height="100%" justifyContent="flex-end">
          <Button variant="contained" onClick={onSend}>
            Enviar
          </Button>
          <Button variant="outlined" color="info" onClick={onReceive} disabled={!isPending}>
            {isPending ? "Recibir " : "Sin Mensajes "}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Mensajes;
