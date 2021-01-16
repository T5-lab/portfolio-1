const express = require('express')
const routes = require('./routes')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const cookieParser = require('cookie-parser')
const auth = require('./auth')
const cors = require('cors')
const {BACKENDURL, FRONTENDURL} = require('./config')
require('termcolor').define()

mongoose.connect('mongodb+srv://admin:UYJja7m47csrHGPE@cluster0.q3l6k.mongodb.net/portfolio-1?retryWrites=true&w=majority', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(() => {
  console.red('Could not connect to mongodb')
})

const app = express()
const PORT = process.env.PORT || 9000
//midllewares
app.use(cors({credentials: true, origin: FRONTENDURL}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
  name: 'sessionId',
  secret: 'JBjdwnknBWFJ5&%^878JNDIOY7',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))
app.use(auth.initialize)
app.use(auth.session)

app.use('/', routes())

app.listen(PORT, () => console.yellow(`Server is up on port ${PORT}`))
