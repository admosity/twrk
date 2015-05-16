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
theInterval = setInterval !->
  io.emit 'scores', {users: activePlayers.map (p) -> {user_id: p.request.session.user_id, score: p.request.session.score}}
  activePlayers.forEach (e) ->
    e.request.session.score *= 0.8
, 2000
io.on 'connection', (socket) ->
  socket.emit 'users', {users: activePlayers.map (p) -> p.request.session}
  socket.on 'join', (data) ->
    socket.request.session{avatar, username} = data
    {avatar, username} = data
    socket.request.session.user_id = idx
    socket.request.session.score = 0;
    socket.request.session.save!
    activePlayers.push socket
    socket.broadcast.emit 'joined', {avatar, username, user_id:idx}
    idx++

  socket.on 'update', (data)-> 
    vt = data.data.split(",");
    socket.request.session.score = (parseFloat vt[6]) * 0.2 + socket.request.session.score * 0.8
    data.user_id = socket.request.session.user_id
    io.emit 'reply', data
  socket.on 'disconnect', ->


    if socket.request.session.user_id?
      io.emit 'user disconnect', {user_id: socket.request.session.user_id}
      removeIdx = activePlayers.indexOf(socket)
      if removeIdx > -1
        activePlayers.splice removeIdx, 1
  
  
