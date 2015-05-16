User = require('mongoose').model('User')
router = require('express').Router()


# allowedActions = <[avatar username]>

router
  ..post 'avatar', (req, res) ->
    req.session.avatar = req.body.avatar
    res.ok!


module.exports = router
  # ..get '/me', (req, res) ->res.ok req.user
  # ..post '/login', (req, res) ->
  #   if username = req.body.username?.trim!
  #     User.findOne {username}, (err, user) ->
  #       req.login user, (err) ->
  #         if err 
  #           res.error err
  #         else
  #           res.ok user
  # ..use '/:id/:action', (req, res) ->
  #   action = req.params.action
  #   if allowedActions.indexOf(action) > -1

  #   else


    
  
  
        
        
      
      

  
  
  