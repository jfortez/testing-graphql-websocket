import { useSubscription } from "@apollo/client";
import React, { Fragment } from "react";
import Subscription from "./components";

import {
  GET_USERS,
  USER_SUBSCRIPTION,
  GET_POSTS,
  USERS_SUBS,
  POSTS_SUBSCRIPTION,
  PROFILE_SUBSCRIPTION,
  GET_PROFILES,
  // SUBSCRIBED_DELETED_POST,
  // SUBSCRIBED_DELETED_PROFILE,
  // SUBSCRIBED_DELETED_USER,
} from "./model";
function App() {
  useSubscription(USER_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { userCreated } = subscriptionData.data;
      const usersInStore = client.readQuery({ query: GET_USERS });
      const lastUserInStore = usersInStore.allUsers?.at(-1);
      if (lastUserInStore?.id === userCreated?.id) return;
      const postsInStore = client.readQuery({ query: GET_POSTS });
      client.writeQuery({
        query: GET_USERS,
        data: {
          ...usersInStore,
          allUsers: [...usersInStore.allUsers, userCreated],
        },
      });
      client.writeQuery({
        query: GET_POSTS,
        data: {
          ...postsInStore,
          allPosts: [...postsInStore.allPosts, ...userCreated.posts],
        },
      });
    },
  });
  useSubscription(USERS_SUBS, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { Users } = subscriptionData.data;
      const usersInStore = client.readQuery({ query: GET_USERS });
      const lastUserInStore = usersInStore.allUsers?.at(-1);
      if (lastUserInStore?.id === Users?.id) return;
      client.writeQuery({
        query: GET_USERS,
        data: {
          ...usersInStore,
          allUsers: [...usersInStore.allUsers, Users],
        },
      });
    },
  });
  useSubscription(POSTS_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { Posts } = subscriptionData.data;
      const postsInStorage = client.readQuery({ query: GET_POSTS });
      const lastPost = postsInStorage.allPosts?.at(-1);
      if (lastPost?.id === Posts?.id) return;
      client.writeQuery({
        query: GET_POSTS,
        data: {
          ...postsInStorage,
          allPosts: [...postsInStorage.allPosts, Posts],
        },
      });
    },
  });
  useSubscription(PROFILE_SUBSCRIPTION, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { Profiles } = subscriptionData.data;
      const ProfilesInStorage = client.readQuery({ query: GET_PROFILES });
      const lastProfile = ProfilesInStorage.allProfile?.at(-1);
      if (lastProfile?.id === Profiles?.id) return;
      client.writeQuery({
        query: GET_PROFILES,
        data: {
          ...ProfilesInStorage,
          allProfile: [...ProfilesInStorage.allProfile, Profiles],
        },
      });
    },
  });
  /* This send a Warning */
  // useSubscription(SUBSCRIBED_DELETED_USER, {
  //   onSubscriptionData: ({ client, subscriptionData }) => {
  //     const { deletedUser } = subscriptionData.data;
  //     const usersInStore = client.readQuery({ query: GET_USERS });
  //     const users = usersInStore.allUsers?.filter((user) => user.id !== deletedUser?.id);
  //     client.writeQuery({
  //       query: GET_USERS,
  //       data: {
  //         ...usersInStore,
  //         allUsers: users,
  //       },
  //     });
  //   },
  // });
  return (
    <Fragment>
      <Subscription />
    </Fragment>
  );
}

export default App;
