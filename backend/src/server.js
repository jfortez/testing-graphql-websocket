const { createServer } = require('http')
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require('apollo-server-core')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { resolvers, typeDefs } = require('./schema')
const { ApolloServer } = require('apollo-server-express')

const serverStart = async () => {
  // Create the schema, which will be used separately by ApolloServer and
  // the WebSocket server.
  const schema = makeExecutableSchema({ typeDefs, resolvers })

  // Create an Express app and HTTP server; we will attach both the WebSocket
  // server and the ApolloServer to this HTTP server.
  const app = express()
  const httpServer = createServer(app)

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if your ApolloServer serves at
    // a different path.
    path: '/graphql',
  })

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      // As before, ctx is the graphql-ws Context where connectionParams live.
      onConnect: async (ctx) => {
        // Check authentication every time a client connects.
        console.log('WebSocket connection established')
      },
      onDisconnect(ctx, code, reason) {
        console.log('Web Socket connection closed')
      },
    },
    wsServer,
  )

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    // context,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  })

  await server.start()
  server.applyMiddleware({ app })

  const PORT = 4000
  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(
      `Server is now running on http://localhost:${PORT}${server.graphqlPath}`,
    )
  })
}

serverStart()
