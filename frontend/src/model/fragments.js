import { gql } from "@apollo/client";

const USER_DETAILS = gql`
  fragment UserDetails on User {
    id
    name
    email
  }
`;
const POST_DETAILS = gql`
  fragment PostDetails on Post {
    id
    content
    title
  }
`;

const PROFILE_DETAILS = gql`
  fragment ProfileDetails on Profile {
    id
    bio
  }
`;

export { USER_DETAILS, POST_DETAILS, PROFILE_DETAILS };
