var crypt = require('../lib/util/crypt')
  , string = require('../lib/util/string');

module.exports = function(mongoose, app){

  var Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId
    , Mixed = Schema.Types.Mixed;
  
  var User = new Schema({
    name: {
      prefix: String
    , first: String
    , middle: String
    , last: String }
  , profile: {
      avatar: {type: ObjectId, ref: 'Media'}
    , bio: String
    }
  , account: {
      username: {type: String, index: true, unique: true}
    , salt: String
    , password: String
    , added_by: String
    , created_at: {type: Date, default: Date.now}
    , roles: []
    , status: String }
  , location: {
      addr: String
    , addr2: String
    , city: String
    , state: String
    , zip: String
    , country: String
    , timezone: String }
  , contact: {
      phone: String
    , email: {type: String, index: true, unique: true}
    , facebook: String
    , twitter: String }
  },{strict: true});
  
  
  User.virtual('account.password_plain').set(function(pwd){
    if (!this.account.salt) this.account.salt = salt();
    this.account.password = crypt.md5(this.account.salt + pwd);
  });
  
  User.virtual('fullname').get(function(){
    return ((this.name.prefix || '') + ' ' + (this.name.first || '') + ' ' 
          + (this.name.middle || '') + ' ' + (this.name.last || ''))
          .replace(/\s+/g, ' ').trim();
  });
  
  User.method({
    
    changePassword: function(old, change){
      if(this.account.password == crypt.md5(this.account.salt + old)){
        this.account.password_plain = change;
        return true;
      } else {
        return false
      }
    }
    
  })
  
  User.static({
    
    authenticate: function(username, password, fn, role){
      if(!(username.length && password.length)) return fn(false);
      
      var query = {};
      query['account.username'] = new RegExp('^' + string.escapeRegExp(username) + '$', 'i');
      
      this.findOne(query).exec(function(err, user){
        fn((user && user.account.password == crypt.md5(user.account.salt + password)) ? user : false);
      });
      
    }
    
  });
  
  
  mongoose.model('User', User);
}


function rand(lbound, ubound){
  return (Math.floor(Math.random() * (ubound - lbound)) + lbound);
};

function salt(length){
  var chars = '!@#$%^&*()_+{}":>?<"~', l = length || 5, ret = '';
  for (var i = 0; i < l; i++){
    ret += chars.charAt(rand(0, chars.length));
  }
  return ret;
};