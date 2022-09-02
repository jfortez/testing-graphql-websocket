import { useQuery, useMutation } from "@apollo/client";
import React, { Fragment, useMemo, useState } from "react";
import ListComponent from "./List";
import {
  GET_USERS,
  GET_POSTS,
  GET_PROFILES,
  DELETE_POST,
  DELETE_PROFILE,
  DELETE_USER,
} from "../model";
import { Grid } from "@mui/material";
import GenerateItems from "./GenerateItems";

const UserList = ({ onSelect }) => {
  const { data, loading, error } = useQuery(GET_USERS);
  const [deleteItem, { loading: loadingUser }] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });
  const { allUsers } = data || {};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const onDelete = async (id) => {
    await deleteItem({ variables: { id } });
  };

  return (
    <ListComponent
      data={allUsers}
      primary="name"
      secondary="email"
      title={"Usuarios"}
      onDelete={onDelete}
      loading={loadingUser}
      onSelect={onSelect}
    />
  );
};

const PostList = ({ onSelect }) => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const [deleteItem, { loading: loadingPost }] = useMutation(DELETE_POST, {
    refetchQueries: [{ query: GET_POSTS }],
  });
  const { allPosts } = data || {};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const onDelete = async (id) => {
    await deleteItem({ variables: { id } });
  };
  return (
    <ListComponent
      data={allPosts}
      primary="title"
      primaryReference={(post) => post.author?.name}
      secondary="content"
      title={"Posts"}
      onDelete={onDelete}
      loading={loadingPost}
      onSelect={onSelect}
    />
  );
};
const ProfileList = ({ onSelect }) => {
  const { data, loading, error } = useQuery(GET_PROFILES);
  const [deleteItem, { loading: loadingProfile }] = useMutation(DELETE_PROFILE, {
    refetchQueries: [{ query: GET_PROFILES }],
  });
  const { allProfile } = data || {};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  const onDelete = async (id) => {
    await deleteItem({ variables: { id } });
  };
  return (
    <Fragment>
      <ListComponent
        data={allProfile}
        primary="user"
        secondary="bio"
        primaryLevel={"name"}
        title={"Perfil"}
        onDelete={onDelete}
        loading={loadingProfile}
        onSelect={onSelect}
      />
    </Fragment>
  );
};

const Lists = () => {
  const [itemSelected, setItemSelected] = useState({ id: -1, type: "" });
  const onSelect = (id, title) => {
    setItemSelected({ id, type: title });
  };
  return (
    <Fragment>
      {useMemo(
        () => (
          <Fragment>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <UserList onSelect={onSelect} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <PostList onSelect={onSelect} />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <ProfileList onSelect={onSelect} />
              </Grid>
            </Grid>
          </Fragment>
        ),
        []
      )}
      <GenerateItems selected={itemSelected} />
    </Fragment>
  );
};

export default Lists;
