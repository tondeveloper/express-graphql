// App Imports
import env from './env'
import cookieParser from 'cookie-parser'
import events from 'events'
import jwt from 'jsonwebtoken'

// This auth library is a mock auth library and should not be used in production!
const authLib = () => {
  let authConfig = {
    tenant: null,
    jwtSecret: '234234token',
    route: {
      login: '/login',
      logout: '/logout'
    }
  }
  const em = new events.EventEmitter()

  const login = (req, res, next) => {
    let user = null
    if (req.body.username === 'cat' && req.body.password === 'meow') {
      user = 'cat841'
    }
    if (req.body.username === 'dog' && req.body.password === 'bark') {
      user = 'dog246'
    }

    if (user) {
      jwt.sign(
        { user },
        authConfig.jwtSecret,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) {
            console.log(err)
          }
          res.cookie('sid', token)
          res.status(200).json()
        }
      )
    } else {
      res.status(401).json()
    }
  }

  const logout = (req, res, next) => {
    res.clearCookie('sid')
    res.redirect('/')
  }

  const verify = async function (){
    return { tenant: '1234536362' }
  }

  const init = (app, config) => {
    if (!app) {
      console.log('Error - Please pass in an express app')
    }
    //This is a shallow merge so keep the objects simple
    authConfig = { ...authConfig, ...config }

    //Add routes
    app.post(authConfig.route.login, login)
    app.post(authConfig.route.logout, logout)

    //Mock register application to 3rd party auth
    verify()
      .then(results => {
        authConfig['tenant'] = results
        em.emit('connected')
      })
      .catch(e => {
        em.emit('error', e)
      })

    return em
  }

  const authenticate = (req, res, next) => {
    if (req.cookies['sid']) {
      const token = req.cookies['sid']
      jwt.verify(token, authConfig.jwtSecret, (error, decoded) => {
        if (error) {
          res.status(401).json({ error })
        }
        req.myData = req.myData || {}
        req.myData.user = decoded.user
        next()
      })
    } else {
      res.status(401).json()
    }
  }

  return {
    init,
    authenticate
  }
}

const config = {
  route: {
    login: '/api/auth/login',
    logout: '/api/auth/logout'
  }
}

class Connection {
  constructor (lib, config) {
    this.auth = lib
    this.config = config
  }
  start (app) {
    return new Promise((resolve, reject) => {
      console.info('SETUP - Connecting auth...')
      this.auth
        .init(app, this.config)
        .on('connected', () => {
          console.log('AUTH - connected')
          resolve()
        })
        .on('error', e => {
          console.log(`AUTH - error - ${e}`)
          reject()
        })
    })
  }
  getConnection () {
    return this.auth
  }
  protect () {
    return this.auth.authenticate
  }
}

const connection = new Connection(authLib(), config)

export default connection
