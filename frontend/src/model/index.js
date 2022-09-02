import { gql } from "@apollo/client";
import { USER_DETAILS, POST_DETAILS, PROFILE_DETAILS } from "./fragments";
const GET_USERS = gql`
  query getUsers {
    allUsers {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;
const SUB = gql`
  subscription getBool {
    truths
  }
`;

const ADD_USER = gql`
  mutation addUser($data: UserCreateInput!) {
    signupUser(data: $data) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

const USER_SUBSCRIPTION = gql`
  subscription getUsersSub {
    userCreated {
      ...UserDetails
      posts {
        ...PostDetails
      }
    }
  }
  ${USER_DETAILS}
  ${POST_DETAILS}
`;
const GET_POSTS = gql`
  query getAllPosts {
    allPosts {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;

const GET_PROFILES = gql`
  query getAllProfile {
    allProfile {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;

const ADD_ONLY_USER = gql`
  mutation addUser($data: UserCreateOnlyUserInput!) {
    addUser(data: $data) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;

const ADD_ONLY_POST = gql`
  mutation addPost($data: PostCreateInput!) {
    addPost(data: $data) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;

const ADD_ONLY_PROFILE = gql`
  mutation addProfile($data: ProfileCreateOnlyInput!) {
    addProfile(data: $data) {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;

const USERS_SUBS = gql`
  subscription getSubscribedUsers {
    Users {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;
const POSTS_SUBSCRIPTION = gql`
  subscription getSubscribedPosts {
    Posts {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;
const PROFILE_SUBSCRIPTION = gql`
  subscription getSubscribedProfiles {
    Profiles {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;

const DELETE_POST = gql`
  mutation deletePost($id: Int!) {
    deletePost(id: $id) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;

const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;
const DELETE_PROFILE = gql`
  mutation deleteProfile($id: Int!) {
    deleteProfile(id: $id) {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;

const SUBSCRIBED_DELETED_USER = gql`
  subscription getDeletedUser {
    deletedUser {
      ...UserDetails
    }
  }
  ${USER_DETAILS}
`;
const SUBSCRIBED_DELETED_POST = gql`
  subscription getDeletedPost {
    deletedPost {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;
const SUBSCRIBED_DELETED_PROFILE = gql`
  subscription getDeletedProfile {
    deletedProfile {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;
const GET_PROFILE_BY_ID = gql`
  query getProfileById($id: Int!) {
    profileById(id: $id) {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;

const GET_POST_BY_ID = gql`
  query getPostById($id: Int!) {
    postById(id: $id) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;

const ADD_USER_TO_PROFILE = gql`
  mutation addUserToProfile($data: ProfileToUser!) {
    addProfileToUser(data: $data) {
      ...ProfileDetails
    }
  }
  ${PROFILE_DETAILS}
`;

const ADD_AUTHOR_TO_POST = gql`
  mutation addAuthor($data: AuthorToPost!) {
    addAuthorToPost(data: $data) {
      ...PostDetails
    }
  }
  ${POST_DETAILS}
`;
export {
  GET_USERS,
  SUB,
  ADD_USER,
  USER_SUBSCRIPTION,
  GET_POSTS,
  GET_PROFILES,
  ADD_ONLY_USER,
  ADD_ONLY_POST,
  ADD_ONLY_PROFILE,
  USERS_SUBS,
  POSTS_SUBSCRIPTION,
  PROFILE_SUBSCRIPTION,
  DELETE_POST,
  DELETE_USER,
  DELETE_PROFILE,
  SUBSCRIBED_DELETED_USER,
  SUBSCRIBED_DELETED_POST,
  SUBSCRIBED_DELETED_PROFILE,
  GET_PROFILE_BY_ID,
  GET_POST_BY_ID,
  ADD_USER_TO_PROFILE,
  ADD_AUTHOR_TO_POST,
};
