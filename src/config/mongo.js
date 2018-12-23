import mongoose from 'mongoose'
import env from './env'

const connectToInstance = function (conn){
  return new Promise((resolve, reject) => {
    // store each instance
    this.connection.push({
      name: conn.name,
      instance: mongoose
        .createConnection(conn.url, conn.options)
        .on('connected', () => {
          console.log(`MongoDB - ${conn.name} - connected`)
          resolve()
        })
        .on('error', err => {
          console.log(`MongoDB - ${conn.name} - connection error: ' + ${err}`)
          reject()
        })
        .on('disconnected', () =>
          console.log(`MongoDB - ${conn.name} - connection disconnected`)
        )
    })
  })
}
const registerCloseListener = function (){
  // If the Node process ends, close all the Mongoose connection
  process.on('SIGINT', () => {
    this.connection.forEach(conn => {
      conn.instance.close()
    })
    process.exit(0)
  })
}

class Connection {
  constructor ({ connectors }) {
    this.connectors = connectors
    this.connection = []
    this.hasStart = false
  }
  start () {
    if (this.hasStart) {
      return Promise.resolve()
    }
    console.info('SETUP - Connecting database...')
    //Iterate and return each as promise
    const promiseInstance = this.connectors.map(conn => {
      return connectToInstance.call(this, conn)
    })

    return Promise.all(promiseInstance)
      .then(() => {
        this.hasStart = true
        registerCloseListener.call(this)
      })
      .catch(err => {
        console.log(err)
      })
  }
  getConnection (name) {
    const connection = this.connection.find(conn => conn.name === name)
    if (connection) {
      return connection.instance
    } else {
      return null
      console.log(`[Error] - ${name} connection instance cannot be found`)
    }
  }
}

// Add your Mongo database connection
const connectors = [
  {
    name: 'mongo1',
    url: env.get('MONGO_URL_1'),
    options: { useNewUrlParser: true, useCreateIndex: true }
  },
  {
    name: 'mongo2',
    url: env.get('MONGO_URL_2'),
    options: { useNewUrlParser: true, useCreateIndex: true }
  }
]

// return Singleton
const connection = new Connection({ connectors })

export default connection
