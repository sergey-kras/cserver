const User = require("../database/user");
let UserSchema = require("../schemas/user");
let RefererSchema = require("../schemas/referers");
var rn = require("random-number");
let md5 = require('md5');
var emailServer = require("emailjs");
const http = require('http');
var gen = rn.generator({
  min: 100000,
  max: 999999,
  integer: true
});

class referersProvider {
  constructor(ctx) {
    this.ctx = ctx;
    this.user = ctx.state.user;
  }

  validateRoot() {
    let result;
    if (this.user.rang === "manager" || this.user.rang === "admin") {
      result = true;
    } else {
      result = false;
    }
    console.log("validateRoot", result);
    return result;
  }

  async getUsers() {
    if (!this.validateRoot()) return {
      message: "Недостаточно прав"
    };
    let referers = await RefererSchema.find({
      userRefererId: this.user._id
    });
    let result = await referers.map(async referer => {
      let user = await UserSchema.find({
        _id: referer.userId
      });
      if (!user[0]) return {
        message: "Пока нет ни одного пользователя"
      };
      return {
        id: user[0]._id,
        onlineStatus: user[0].onlineStatus,
        name: user[0].name,
        login: user[0].login,
        mail: user[0].mail,
        whiteIp: user[0].whiteIp,
        blackIp: user[0].blackIp
      };
    });
    result = await Promise.all(result);
    return result;
  }

  sendMail(email, text) {
    function mailString(mail){
      let getString = "";
      for (var key in mail) {
        if (getString != "") {
          getString += "&"; 
        }
        getString += key + "=" + encodeURIComponent(mail[key]);
      }
      return getString;
    }
    let mail = {
      mail: email,
      subject: "Смена пароля",
      text:text,
    };

    let NewMail = {
      mail: 'scan.neurobis.ru',
      subject: "Смена пароля",
      text:text,
    };
    console.log(new Date(), mail)
    http.get('http://185.178.44.154:5000/email?' + mailString(mail), resp => {});
  }

  async removeUser() {
    if (!this.validateRoot()) return {
      message: "Недостаточно прав"
    };
    let removableId = this.ctx.params.id;
    let removableUser = await UserSchema.find({
      _id: removableId
    });
    let refStatus = await RefererSchema.remove({
      userId: removableId,
      userRefererId: this.user._id
    });
    let userStatus = await UserSchema.remove({
      _id: removableId
    });
    this.sendMail(removableUser[0].mail, 'Ваш аккаунт удален администратором ' + this.user.mail);
    
    if (refStatus.ok == 1 && userStatus == 1) {
      return {
        status: true
      };
    }
    return {
      status: false
    };
  }

  async resetThePassword() {
    if (!this.validateRoot()) return {
      message: "Недостаточно прав"
    };
    let resetableUser = this.ctx.params.id;
    let mailSubscribe = this.ctx.request.body.mailSubscribe;
    let newPass = String(gen());
    let mailStatus;
    let result = await UserSchema.updateOne({
      _id: resetableUser
    }, {
      password: md5(newPass),
      sid: null
    });
    if (mailSubscribe) {
      let user = await UserSchema.find({
        _id: resetableUser
      });
      let mail = user[0].mail;
      this.sendMail(mail, 'Ваш новый пароль ' + newPass);
    }
    if (result.nModified === 1) {
      return {
        status: 'success'
      }
    }
    return {
      status: 'error'
    };
  }
}

module.exports = referersProvider;