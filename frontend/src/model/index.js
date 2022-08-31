import { gql } from "@apollo/client";

const GET_USERS = gql`
  query getUsers {
    allUsers {
      id
      name
      email
    }
  }
`;
const SUB = gql`
  subscription getBool {
    truths
  }
`;

const ADD_USER = gql`
  mutation addUser($data: UserCreateInput!) {
    signupUser(data: $data) {
      id
      name
      email
    }
  }
`;

const USER_SUBSCRIPTION = gql`
  subscription getUsersSub {
    userCreated {
      id
      name
      email
    }
  }
`;
const GET_POSTS = gql`
  query getAllPosts {
    allPosts {
      id
      content
      title
    }
  }
`;

const GET_PROFILES = gql`
  query getAllProfile {
    allProfile {
      bio
      id
      user {
        name
      }
    }
  }
`;

export { GET_USERS, SUB, ADD_USER, USER_SUBSCRIPTION, GET_POSTS, GET_PROFILES };
