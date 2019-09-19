const bcrypt = require("bcrypt");

const users = {
  data: new Map(),
  json: function() {
    let users = [];
    for (let [key, value] of this.data) users.push(value);
    return users;
  },
  findByUsername: function(username) {
    for (let [key, value] of this.data) {
      if (value.nickname == username) return value;
    }
    return undefined;
  },
  findById: function(id) {
    for (let [key, value] of this.data) {
      if (key == id) return value;
    }
    return undefined;
  },
  add: function(user) {
    if (user.id == undefined) {
      user.id = this.data.size + 1;
    }
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
    this.data.set(user.id, user);
  }
};

users.data.set(1, {
  id: 1,
  name: "Jen Jones",
  nickname: "jones",
  password: "$2b$10$C.FoziHbuzDOSISdncrrW.jQkEFeCNocxlnxBfAH/xyAWLrptuhrG",
  email: "jones@jen.com"
});

module.exports = users;