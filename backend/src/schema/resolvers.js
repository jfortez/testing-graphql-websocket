const { PrismaClient } = require('@prisma/client')
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()
const prisma = new PrismaClient()
const resolvers = {
  Query: {
    allPosts: async () => {
      const data = await prisma.post.findMany()
      return data
    },
    allProfile: async () => {
      const data = await prisma.profile.findMany()
      return data
    },
    allUsers: async () => {
      const data = await prisma.user.findMany()
      return data
    },
    draftsByUser: async (_, { userUniqueInput }) => {
      const { id, email } = userUniqueInput
      const data = await prisma.user
        .findUnique({
          where: {
            id: id || undefined,
            email: email || undefined,
          },
        })
        .posts({
          where: {
            published: true,
          },
        })
      return data
    },
    feed: async (_parent, args) => {
      const or = args.searchString
        ? {
            OR: [
              { title: { contains: args.searchString } },
              { content: { contains: args.searchString } },
            ],
          }
        : {}

      return await prisma.post.findMany({
        where: {
          published: true,
          ...or,
        },
        take: args.take || undefined,
        skip: args.skip || undefined,
        orderBy: args.orderBy || undefined,
      })
    },
    postById: async (_parent, args) => {
      return await prisma.post.findUnique({
        where: { id: args.id || undefined },
      })
    },
    profileById: async (_parent, args) => {
      return await prisma.profile.findUnique({
        where: { id: args.id || undefined },
      })
    },
  },
  User: {
    posts: async (parent) => {
      return await prisma.user
        .findUnique({
          where: { id: parent.id },
        })
        .posts()
    },
    profile: async (parent) => {
      return await prisma.user
        .findUnique({
          where: { id: parent.id },
        })
        .profile()
    },
  },
  Post: {
    author: async (parent) => {
      return await prisma.post
        .findUnique({
          where: {
            id: parent.id,
          },
        })
        .author()
    },
  },
  Profile: {
    user: async (parent) => {
      return await prisma.profile
        .findUnique({
          where: { id: parent.id },
        })
        .user()
    },
  },
  Mutation: {
    /* Creating a new user and publishing the event to the pubsub. */
    signupUser: async (_parent, { data }) => {
      const { email, name, posts } = data
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          posts: {
            create: posts,
          },
        },
      })
      pubsub.publish('USER_CREATED', { userCreated: newUser })
      return newUser
    },
    addUser: async (_, { data }) => {
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
        },
      })
      pubsub.publish('ONLY_USER_CREATED', {
        Users: newUser,
      })
      return newUser
    },
    addPost: async (_, { data }) => {
      const newPost = await prisma.post.create({
        data,
      })
      pubsub.publish('ONLY_POST_CREATED', { Posts: newPost })
      return newPost
    },
    addProfile: async (_, { data }) => {
      const newProfile = await prisma.profile.create({
        data,
      })
      pubsub.publish('ONLY_PROFILE_CREATED', { Profiles: newProfile })
      return newProfile
    },
    deleteUser: async (_, { id }) => {
      const deletedUser = await prisma.user.delete({
        where: { id },
      })
      // pubsub.publish('USER_DELETED', {
      //   deletedUser,
      // })
      return deletedUser
    },
    deletePost: async (_, { id }) => {
      const deletedPost = await prisma.post.delete({
        where: { id },
      })
      // pubsub.publish('POST_DELETED', {
      //   deletedPost,
      // })
      return deletedPost
    },
    deleteProfile: async (_, { id }) => {
      const deletedProfile = await prisma.profile.delete({
        where: { id },
      })
      // pubsub.publish('PROFILE_DELETED', {
      //   deletedProfile,
      // })
      return deletedProfile
    },
    addAuthorToPost: async (_, { data }) => {
      const updatePost = await prisma.post.update({
        where: { id: data.id },
        data: {
          authorId: data.authorId,
        },
      })
      return updatePost
    },
    addProfileToUser: async (_, { data }) => {
      const updateUser = await prisma.profile.update({
        where: { id: data.id },
        data: {
          userId: data.userId,
        },
      })
      return updateUser
    },
  },
  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator('USER_CREATED'),
    },
    Users: {
      subscribe: () =>
        pubsub.asyncIterator(['ONLY_USER_CREATED', 'USER_DELETED']),
    },
    Posts: {
      subscribe: () => pubsub.asyncIterator('ONLY_POST_CREATED'),
    },
    Profiles: {
      subscribe: () => pubsub.asyncIterator('ONLY_PROFILE_CREATED'),
    },
    // deletedUser: {
    //   subscribe: () => pubsub.asyncIterator('USER_DELETED'),
    // },
    // deletedPost: {
    //   subscribe: () => pubsub.asyncIterator('POST_DELETED'),
    // },
    // deletedProfile: {
    //   subscribe: () => pubsub.asyncIterator('PROFILE_DELETED'),
    // },
  },
}

module.exports = { resolvers }
