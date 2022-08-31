import { useQuery } from "@apollo/client";
import React from "react";
import ListComponent from "./List";
import { GET_USERS, GET_POSTS, GET_PROFILES } from "../model";
import { Grid } from "@mui/material";

const UserList = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const { allUsers } = data || {};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return <ListComponent data={allUsers} primary="name" secondary="email" title={"Usuarios"} />;
};

const PostList = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const { allPosts } = data || {};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return <ListComponent data={allPosts} primary="title" secondary="content" title={"Posts"} />;
};
const ProfileList = () => {
  const { data, loading, error } = useQuery(GET_PROFILES);
  const { allProfile } = data || {};
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <ListComponent
      data={allProfile}
      primary="user"
      secondary="bio"
      primaryLevel={"name"}
      title={"Perfil"}
    />
  );
};

const Lists = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {/* responsive grid item */}
      <Grid item xs={12} sm={6} md={3}>
        <UserList />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <PostList />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <ProfileList />
      </Grid>
    </Grid>
  );
};

export default Lists;
