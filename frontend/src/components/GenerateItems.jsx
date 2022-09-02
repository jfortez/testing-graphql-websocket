import React, { Fragment, useState } from "react";
import { Autocomplete, Button, Grid, TextField, Dialog, Box, DialogTitle } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { faker } from "@faker-js/faker";
import {
  ADD_USER,
  ADD_ONLY_POST,
  ADD_ONLY_PROFILE,
  ADD_ONLY_USER,
  GET_POST_BY_ID,
  GET_PROFILE_BY_ID,
  GET_USERS,
  ADD_AUTHOR_TO_POST,
  ADD_USER_TO_PROFILE,
} from "../model";

const getRandomUser = (args) => {
  const name = faker.name.firstName();
  const lastName = faker.name.lastName();
  const fullName = `${name} ${lastName}`;
  const email = faker.internet.email(name, lastName);
  return { name: args?.name ?? fullName, email: args?.email ?? email };
};

const getRandomPost = (args) => {
  const title = faker.music.genre();
  const content = faker.music.songName();
  return { title: args?.title ?? title, content: args?.content ?? content };
};

const getRandomProfile = (args) => {
  const bio = faker.random.words(5);
  return { bio: args?.bio ?? bio };
};

const initialState = {
  user: {
    initialData: (args) => getRandomUser(args),
    mutation: ADD_USER,
  },
  post: {
    initialData: (args) => getRandomPost(args),
    mutation: ADD_ONLY_POST,
    query: GET_POST_BY_ID,
  },
  profile: {
    initialData: (args) => getRandomProfile(args),
    mutation: ADD_ONLY_PROFILE,
    query: GET_PROFILE_BY_ID,
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
      readonly: true,
    },
    content: {
      type: "text",
      label: "Contenido",
      readonly: true,
    },
    author: {
      type: "list",
      label: "Autor",
    },
  },

  profile: {
    bio: {
      type: "text",
      label: "Bio",
      readonly: true,
    },
    user: {
      type: "list",
      label: "Usuario",
    },
  },
};

const CreateForm = ({ handleClose, open, dataSource, item = {}, users, onSubmit = () => {} }) => {
  const key = initialState[open];
  const [data, setData] = useState(key?.initialData(item));
  const [addUser] = useMutation(key?.mutation);
  const handleOnSubmit = (e) => {
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
    if (open === "user") {
      addUser({ variables: { data: newData } }).then((e) => {
        setData(key.initialData(item));
      });
    }
    const args = { ...data, ...item };
    onSubmit(args);
    handleClose();
  };
  return (
    <form onSubmit={handleOnSubmit}>
      <Grid container spacing={4} pt={2}>
        {Object.keys(dataSource[open]).map((e) => {
          const content = dataSource[open][e];
          return (
            <Grid item xs={12} key={e}>
              {content.type === "text" ? (
                <TextField
                  id={e}
                  name={e}
                  label={content.label}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={data[e]}
                  onChange={(evt) => setData((prev) => ({ ...prev, [e]: evt.target.value }))}
                  InputProps={{
                    readOnly: content.readonly,
                  }}
                />
              ) : content.type === "list" ? (
                <Autocomplete
                  id={e}
                  size="small"
                  fullWidth
                  options={users}
                  value={item[e]}
                  getOptionLabel={(option) => option.name}
                  onChange={(_, value) => setData((prev) => ({ ...prev, userId: value?.id }))}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} label={content.label} name={e} />}
                />
              ) : null}
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
                onClick={handleClose}
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

const GenerateItems = ({ selected }) => {
  const [open, setOpen] = useState({ user: false, post: false, profile: false });
  const { id, type } = selected;
  const isSkipeable = id === -1 || type === "Usuarios";
  /** Get data by Id */
  const { data, loading } = useQuery(type === "Posts" ? GET_POST_BY_ID : GET_PROFILE_BY_ID, {
    skip: isSkipeable,
    variables: { id },
  });
  /** get Users */
  const { data: usersData, loading: loadingUsers } = useQuery(GET_USERS, {
    skip: isSkipeable,
  });
  const { allUsers } = usersData || {};
  const { profileById, postById } = data || {};
  /* No Refetching queries after create a item */
  const [addUser] = useMutation(ADD_ONLY_USER);
  const [addPost] = useMutation(ADD_ONLY_POST);
  const [addAuthor] = useMutation(ADD_AUTHOR_TO_POST);
  /* ------ */
  /** No Refetching queries, but for no reason update o subscribe the data */
  const [addUserProfile] = useMutation(ADD_USER_TO_PROFILE);
  const [addProfile] = useMutation(ADD_ONLY_PROFILE);
  /* ------ */
  const handleUser = async () => {
    await addUser({ variables: { data: getRandomUser() } });
  };
  const handlePost = async () => {
    await addPost({ variables: { data: getRandomPost() } });
  };
  const handleProfile = async () => {
    await addProfile({ variables: { data: getRandomProfile() } });
  };
  const hasOpen = Object.values(open).some((e) => e);
  const whoIsOpen = Object.keys(open).find((e) => open[e]);

  const onSubmit = async (args) => {
    const { id, userId } = args; //postId
    if (whoIsOpen === "post") {
      if (!userId) return;

      await addAuthor({ variables: { data: { id, authorId: userId } } });
    }
    if (whoIsOpen === "profile") {
      if (!userId) return;
      await addUserProfile({ variables: { data: { id, userId } } });
    }
  };
  const handleClose = () => {
    setOpen({ user: false, post: false, profile: false });
  };
  const title =
    whoIsOpen === "post"
      ? "Asignar Post"
      : whoIsOpen === "profile"
      ? "Asignar Perfil"
      : whoIsOpen === "user"
      ? "Crear Usuario"
      : "Titulo indefinido";
  return (
    <Fragment>
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
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => setOpen((prev) => ({ ...prev, user: true }))}
            disabled={hasOpen}
          >
            Crear Usuario
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} xl={2}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => setOpen((prev) => ({ ...prev, post: true }))}
            disabled={!(selected.type === "Posts") || hasOpen}
          >
            Asignar Post
          </Button>
        </Grid>
        <Grid item xs={6} sm={4} xl={2}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => setOpen((prev) => ({ ...prev, profile: true }))}
            disabled={!(selected.type === "Perfil") || hasOpen}
          >
            Asignar Perfil
          </Button>
        </Grid>
      </Grid>
      {hasOpen ? (
        <Dialog open={open[whoIsOpen]} onClose={handleClose}>
          <DialogTitle textAlign="center" fontWeight={600} textTransform="uppercase">
            {title}
          </DialogTitle>
          <Box p={3} pt={0}>
            {whoIsOpen === "user" ? (
              <CreateForm handleClose={handleClose} open={whoIsOpen} dataSource={forms} />
            ) : whoIsOpen === "post" ? (
              loading || loadingUsers ? (
                <div>cargando</div>
              ) : (
                <CreateForm
                  handleClose={handleClose}
                  open={whoIsOpen}
                  dataSource={forms}
                  item={postById}
                  users={allUsers}
                  onSubmit={onSubmit}
                />
              )
            ) : whoIsOpen === "profile" ? (
              loading || loadingUsers ? (
                <div>cargando</div>
              ) : (
                <CreateForm
                  handleClose={handleClose}
                  open={whoIsOpen}
                  dataSource={forms}
                  item={profileById}
                  users={allUsers}
                  onSubmit={onSubmit}
                />
              )
            ) : null}
          </Box>
        </Dialog>
      ) : null}
    </Fragment>
  );
};

export default GenerateItems;
