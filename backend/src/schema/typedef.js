const { gql } = require('apollo-server-express')

const typeDefs = gql`
  scalar DateTime
  type Mutation {
    incrementPostViewCount(id: Int!): Post
    signupUser(data: UserCreateInput!): User!
    togglePublishPost(id: Int!): Post
    addUser(data: UserCreateOnlyUserInput!): User!
    addPost(data: PostCreateInput!): Post!
    addProfile(data: ProfileCreateOnlyInput!): Profile!
    deleteUser(id: Int!): User
    deletePost(id: Int!): Post
    deleteProfile(id: Int!): Profile
    addAuthorToPost(data: AuthorToPost!): Post
    addProfileToUser(data: ProfileToUser!): Profile
  }
  input AuthorToPost {
    id: Int!
    authorId: Int!
  }
  input ProfileToUser {
    id: Int!
    userId: Int!
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
    postById(id: Int!): Post
    profileById(id: Int!): Profile
  }

  enum SortOrder {
    asc
    desc
  }

  type Subscription {
    truths: Boolean
    hello: String!
    userCreated: User!
    Users: User!
    Posts: Post!
    Profiles: Profile!
    deletedUser: User!
    deletedPost: Post!
    deletedProfile: Profile!
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
  input UserCreateOnlyUserInput {
    email: String!
    name: String
  }
  input ProfileCreateOnlyInput {
    bio: String
  }
`

module.exports = { typeDefs }
