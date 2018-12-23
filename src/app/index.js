import path from 'path'

const startApp = (app, express, dependancies) => {
  //expose handling of static html on server side (to expose a login form)
  app.use(express.static(path.join(__dirname, 'views')))

  //Add login on root to test graphql
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/intro.html'))
  })
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'))
  })
  app.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/logout.html'))
  })

  return app
}

export default startApp
