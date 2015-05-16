require! {
  passport
}

User = require('mongoose').model 'User'

passport.serializeUser (user, done) -> done null, user._id

passport.deserializeUser (id, done) ->
  User.findById id, (err, user) -> done err, user
