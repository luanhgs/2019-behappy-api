const JWT = require("jsonwebtoken");

const tokens = {
  data: new Map(),
  secret: "NeverShareYourSecret",
  add: function(user, expiration) {
    token = JWT.sign(user, this.secret, { expiresIn: "24h" });
    this.data.set(user.email, token);
    return token;
  },
  rm: function(user) {
    token = this.data.delete(user.email);
    return token;
  },
  remove: function(user) {
    this.rm(user);
  },
  findByUser: function(user) {
    return this.data.get(user.email);
  }
};

module.exports = tokens;
