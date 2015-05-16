require! {
  mongoose
}


UserSchema = mongoose.Schema {
  avatar: Number
  username: String
  dateJoined: {type: Date, default: Date.now}
}, collection: 'User'

mongoose.model 'User', UserSchema