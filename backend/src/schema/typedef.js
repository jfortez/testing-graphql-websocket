const { gql } = require('apollo-server-express')

const typeDefs = gql`
  scalar DateTime
  type Mutation {
    addProfileForUser(bio: String, userUniqueInput: UserUniqueInput!): Profile
    createDraft(authorEmail: String!, data: PostCreateInput!): Post
    deletePost(id: Int!): Post
    incrementPostViewCount(id: Int!): Post
    signupUser(data: UserCreateInput!): User!
    togglePublishPost(id: Int!): Post
  }

  type Post {
    author: User
    content: String
    createdAt: DateTime!
    id: Int!
    published: Boolean!
    title: String!
    updatedAt: DateTime!
    viewCount: Int!
  }

  input PostCreateInput {
    content: String
    title: String!
  }

  input PostOrderByUpdatedAtInput {
    updatedAt: SortOrder!
  }

  type Profile {
    bio: String
    id: Int!
    user: User
  }

  type Query {
    allUsers: [User!]!
    allPosts: [Post!]!
    allProfile: [Profile!]!
    draftsByUser(userUniqueInput: UserUniqueInput!): [Post]
    feed(
      orderBy: PostOrderByUpdatedAtInput
      searchString: String
      skip: Int
      take: Int
    ): [Post!]!
    postById(id: Int): Post
  }

  enum SortOrder {
    asc
    desc
  }

  type Subscription {
    truths: Boolean
    hello: String!
    userCreated: User!
  }

  type User {
    email: String!
    id: Int!
    name: String
    posts: [Post!]!
    profile: Profile
  }

  input UserCreateInput {
    email: String!
    name: String
    posts: [PostCreateInput!]
  }

  input UserUniqueInput {
    email: String
    id: Int
  }
`

module.exports = { typeDefs }
