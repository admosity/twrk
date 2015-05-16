require! {
  express
  'express-session': session
  mongoose
  'connect-mongo': connectMongo
  'body-parser': bodyParser
  'cookie-parser': cookieParser
  passport
  morgan
  errorhandler: errorHandler
  'serve-static': serveStatic
  'basic-auth': basicAuth
  'async'
  nconf
  cson: CSON
}

h = require('http')

h.ServerResponse.prototype.ok = (data) ->
  @json data

h.ServerResponse.prototype.error = (status, message, meta) ->
  @status(status).json {message, meta}

nconf
  .env!
  .argv!

if process.env.NODE_ENV == 'production'
  development = false
  nconf.file do
    file: './production.cson'
    format:
      parse: (str) -> CSON.parse(str) 
      stringify: CSON.stringify
else
  development = true
  nconf.file do
    file: './development.cson'
    format:
      parse: (str) -> CSON.parse(str) 
      stringify: CSON.stringify
# connect to mongodb
require './models/index'
mongoose.connect nconf.get('MONGO_URI') || nconf.get('MONGOLAB_URI')
console.log nconf.get!
app = express!
server = require('http').Server(app)
io = require('socket.io')(server)
MongoStore = connectMongo session

port = null
host = null

if development
  app
    ..use morgan('dev')
    ..use errorHandler!
  port = 3000
  host = 'localhost'
else
  port = process.env.PORT

SERVER_URL = nconf.get('SERVER_URL')

sessionMiddleware = session do
    resave: true
    saveUninitialized: true
    secret: 'SOME SECRET'
    store: new MongoStore mongooseConnection: mongoose.connection
io.use (socket, next) ->
  sessionMiddleware(socket.request, socket.request.res, next)


app
  ..set 'view engine', 'ejs'
  ..use serveStatic 'public'
  ..use '/dist', serveStatic 'dist', index: false
  ..use cookieParser!
  ..use bodyParser.urlencoded extended: true
  ..use bodyParser.json!
  ..use sessionMiddleware

  ..use '/user', require './routes/user'
  ..use '*', (req, res)->res.render('index', SERVER_URL:SERVER_URL)

  # ..use passport.initialize!
  # ..use passport.session!
# require './config/passport'

  # server = ..listen port, !->
  #   server.address()
  #     host = ..address
  #     port = ..port
  #   console.log "Server listening at http://%s:%s", if host=='0.0.0.0' then 'localhost' else host, port

server.listen port

# allClients = []
activePlayers = []
idx = 0
io.on 'connection', (socket) ->
  console.log 'connection'

  socket.on 'join', (data) ->
    socket.request.session{avatar, username} = data
    socket.request.session.user_id = idx
    socket.request.session.save!
    activePlayers.push socket
    idx++
    console.log socket.request.session
    io.emit 'connect', {avatar, username, id:idx}
    socket.emit 'users', {users: activePlayers.map (p) -> p.request.session}
    

  socket.on 'update', (data)-> 
    # console.log socket.request.session
    # socket.request.session.data = data
    # socket.request.session.save!
    console.log 'update here'
    data.id = socket.request.session.user_id
    console.log data
    io.emit 'reply', data
  socket.on 'disconnect', ->
    console.log 'user disconnected'



    io.emit 'user disconnect'
    if socket.request.session.user_id != null
      removeIdx = activePlayers.indexOf(socket)
      activePlayers.slice removeIdx, 1
  
  
