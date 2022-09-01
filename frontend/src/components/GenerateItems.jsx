import React, { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";
import { useMutation } from "@apollo/client";
import { faker } from "@faker-js/faker";
import { ADD_USER, ADD_ONLY_POST, ADD_ONLY_PROFILE, ADD_ONLY_USER } from "../model";

const getRandomUser = () => {
  const name = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email(name, lastName);
  return { name, email };
};

const getRandomPost = () => {
  const title = faker.music.genre();
  const content = faker.music.songName();
  return { title, content };
};

const getRandomProfile = () => {
  const bio = faker.random.words(5);
  return { bio };
};

const initialState = {
  user: {
    initialData: () => getRandomUser(),
    mutation: ADD_USER,
  },
  post: {
    initialData: () => getRandomPost(),
    mutation: ADD_ONLY_POST,
  },
  profile: {
    initialData: () => getRandomProfile(),
    mutation: ADD_ONLY_PROFILE,
  },
};
const forms = {
  user: {
    name: {
      type: "text",
      label: "Nombre",
    },
    email: {
      type: "text",
      label: "Email",
    },
  },

  post: {
    title: {
      type: "text",
      label: "Titulo",
    },
    content: {
      type: "text",
      label: "Contenido",
    },
  },

  profile: {
    bio: {
      type: "text",
      label: "Bio",
    },
  },
};
const CreateForm = ({ setState, open, dataSource }) => {
  const [data, setData] = useState(initialState[open].initialData());
  const [addUser] = useMutation(initialState[open].mutation);
  const onSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ...data,
      ...(open === "user" && {
        posts: [
          {
            ...getRandomPost(),
          },
        ],
      }),
    };
    addUser({ variables: { data: newData } }).then((e) => {
      setData(initialState[open].initialData());
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={4} pt={2}>
        {Object.keys(dataSource[open]).map((e) => {
          return (
            <Grid item xs={12} key={e}>
              <TextField
                id={e}
                label={dataSource[open][e].label}
                variant="outlined"
                size="small"
                fullWidth
                value={data[e]}
                onChange={(e) => setData((prev) => ({ ...prev, [open]: e.target.value }))}
              />
            </Grid>
          );
        })}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button color="primary" variant="contained" fullWidth type="submit">
                Enviar
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                color="inherit"
                variant="outlined"
                fullWidth
                type="button"
                onClick={() => setState((prev) => ({ user: false, post: false, profile: false }))}
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
// <Grid item xs={12} sm={8} md={5} xl={4}>

const GenerateItems = () => {
  const [open, setOpen] = useState({ user: false, post: false, profile: false });
  const [addUser] = useMutation(ADD_ONLY_USER);
  const [addPost] = useMutation(ADD_ONLY_POST);
  const [addProfile] = useMutation(ADD_ONLY_PROFILE);
  const handleUser = async () => {
    await addUser({ variables: { data: getRandomUser() } }).then((e) => console.log(e));
  };
  const handlePost = async () => {
    await addPost({ variables: { data: getRandomPost() } });
  };
  const handleProfile = async () => {
    await addProfile({ variables: { data: getRandomProfile() } });
  };
  const hasOpen = Object.values(open).some((e) => e);
  const whoIsOpen = Object.keys(open).find((e) => open[e]);
  return (
    <Grid container spacing={2} pt={4} justifyContent="center">
      <Grid item xs={6} sm={4} xl={2}>
        <Button color="success" variant="contained" fullWidth onClick={handleUser}>
          Generar Usuario
        </Button>
      </Grid>
      <Grid item xs={6} sm={4} xl={2}>
        <Button color="success" variant="contained" fullWidth onClick={handlePost}>
          Generar Post
        </Button>
      </Grid>
      <Grid item xs={6} sm={4} xl={2}>
        <Button color="success" variant="contained" fullWidth onClick={handleProfile}>
          Generar Perfil
        </Button>
      </Grid>
      <Grid item xs={6} sm={4} xl={2}>
        {open.user ? (
          <CreateForm setState={setOpen} open={whoIsOpen} dataSource={forms} />
        ) : (
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => setOpen((prev) => ({ ...prev, user: true }))}
            disabled={hasOpen}
          >
            Crear Usuario
          </Button>
        )}
      </Grid>
      <Grid item xs={6} sm={4} xl={2}>
        {open.post ? (
          <CreateForm setState={setOpen} open={whoIsOpen} dataSource={forms} />
        ) : (
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => setOpen((prev) => ({ ...prev, post: true }))}
            disabled={hasOpen}
          >
            Asignar Post
          </Button>
        )}
      </Grid>
      <Grid item xs={6} sm={4} xl={2}>
        {open.profile ? (
          <CreateForm setState={setOpen} open={whoIsOpen} dataSource={forms} />
        ) : (
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => setOpen((prev) => ({ ...prev, profile: true }))}
            disabled={hasOpen}
          >
            Asignar Perfil
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default GenerateItems;
