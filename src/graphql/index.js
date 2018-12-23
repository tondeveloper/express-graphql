import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import { makeExecutableSchema } from 'graphql-tools'

// Import all typeDef to match resolver spec
const buildTypeDefs = () => {
  const typeDefsArray = fileLoader(
    path.join(__dirname, './typeDefs/**/*.graphql')
  )
  return mergeTypes(typeDefsArray)
}

// Import all resolver files and apply dependancies
// to generate a graphql spec resolver map
const buildResolvers = dependancies => {
  let resolversArray = fileLoader(
    path.join(__dirname, './resolvers/**/*.js')
  ).map(resolverImport => {
    return resolverImport(dependancies)
  })
  return mergeResolvers(resolversArray)
}

// Import all that is needed to build context at resolver method level
const buildContexts = dependancies => {
  return ({ req }) => {
    // middleware attaches auth data for use
    return { user: req.myData.user }
  }
}

// Attach graphql to express app and add subscription via sockets
const startGraphQL = (app, httpServer, dependancies) => {
  const typeDefs = buildTypeDefs()
  const resolvers = buildResolvers(dependancies)
  const context = buildContexts(dependancies)
  const myApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    tracing: true
  })
  //add auth to this endpoint
  app.use('/api/graphql', dependancies.config.auth.protect())

  myApolloServer.applyMiddleware({ app, path: '/api/graphql' })

  //add subscription
  myApolloServer.installSubscriptionHandlers(httpServer)

  console.log('[OK] Graphql endpoint is /api/graphql')
  return app
}

export default startGraphQL
