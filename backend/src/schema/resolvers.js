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
  },
  Subscription: {
    hello: {
      // Example using an async generator
      subscribe: async function* () {
        for await (const word of ['Hello', 'Bonjour', 'Ciao']) {
          yield { hello: word }
        }
      },
    },
    truths: {
      subscribe() {
        return (async function* () {
          while (true) {
            await new Promise((res) => setTimeout(res, 1000))
            yield Math.random() > 0.5
          }
        })()
      },
      resolve(eventData) {
        return eventData
      },
    },
    userCreated: {
      subscribe: () => pubsub.asyncIterator('USER_CREATED'),
    },
  },
}

module.exports = { resolvers }
