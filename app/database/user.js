let UserSchema = require("../schemas/user");
let RefererSchema = require("../schemas/referers");
let md5 = require('md5');
var rn = require("random-number");
var gen = rn.generator({
  min: 100000,
  max: 999999,
  integer: true
});
const Guid = require("guid");

class User {
  constructor() {}

  async checkEmail(mail) {
    let result = await UserSchema.find({
      mail
    });
    console.log(result, mail);
    if (result[0]) return true;
    return false;
  }

  updateSid(_id, newSid) {
    return UserSchema.updateOne({
      _id
    }, {
      sid: newSid
    }).then(status => {
      console.log(status);
    });
  }

  async addUser(refererId, emailUser, password) {
    let newLogin = "User" + gen();
    let SaveUser = new UserSchema({
      name: '',
      login: newLogin,
      mail: emailUser,
      password: md5(password),
      rang: "user",
      onlineStatus: false,
      subscribe: new Date(),
      sid: null,
      blackIp: null,
      whiteIp: null
    });

    let result = await SaveUser.save();

    let SaveReferer = new RefererSchema({
      userId: result._id,
      userRefererId: refererId
    });
    await SaveReferer.save();

    return {
      id: result._id,
      onlineStatus: result.onlineStatus,
      name: result.name,
      login: result.login,
      mail: result.mail,
      whiteIp: result.whiteIp,
      blackIp: result.blackIp,
      password: result.password,
    };
  }
  checkSession(sid) {
    return UserSchema.find({
      sid
    }).then(result => {
      if (!result[0]) return false;
      return result;
    });
  }
  loginUser({
    login,
    password
  }) {
    return UserSchema.find({
      login,
      password: password
    }).then(result => {
      if (!result[0]) return false;
      const sid = Guid.raw();
      this.updateSid(result[0]._id, sid);
      return {
        res: result[0],
        sid
      };
    });
  }
}

module.exports = new User();