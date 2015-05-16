require! {
  mongoose
}


UserSchema = mongoose.Schema {
  avatar: Number
  username: String
  
}, collection: 'User'

mongoose.model 'User', UserSchema