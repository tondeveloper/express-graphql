import express from 'express'
import { createServer } from 'http'
import bodyParser from 'body-parser'
import cookiesParser from 'cookie-parser'
import path from 'path'

import startApp from './app'
import startGraphQL from './graphql'

import mongo from './config/mongo'
import env from './config/env'
import auth from './config/auth'

import services from './services'

// Bootstrap express app and graphql app before exposing port
let app = express()

// Load your main middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookiesParser())

//stand up server instance
const httpServer = createServer(app)

//Start all connections, once everything is a go then server will be ready
Promise.all([mongo.start(), auth.start(app)])
  .then(() => {
    // config dependancies and servies
    const config = {
      mongo,
      env,
      auth
    }
    const dependancies = {
      services: services(config),
      config: config
    }
    return { dependancies }
  })
  .then(({ dependancies }) => {
    // inject them into your apps
    app = startApp(app, express, dependancies)
    app = startGraphQL(app, httpServer, dependancies)
    return app
  })
  .then(app => {
    //Open server on port
    httpServer.listen({ port: 3000 }, () => {
      console.log(`[OK] Server ready at localhost:3000`)
    })
  })
  .catch(e => {
    console.log(`[NOT OK] Server Boot Error - ${e}`)
  })

export default app
