const User = require("../database/user");
let md5 = require('md5');
var rn = require("random-number");
var gen = rn.generator({
  min: 100000,
  max: 999999,
  integer: true
});

class newUser {
  constructor(user, ctx) {
    this.ctx = ctx;
    this.user = user;
    console.log(user);
  }

  async main() {
    if (!this.validateRoot()) return { message: "Недостаточно прав" };
    if (await this.validateEmail())
      return { message: "Этот email уже существует" };

    let newUser = await this.saveInBase();
    await this.sendMail();
    newUser.password = null;
    return newUser;
  }

  async validateEmail() {
    let result = await User.checkEmail(this.ctx.request.body.email);
    console.log("validateEmail", !result);
    return result;
  }

  validateRoot() {
    let result;
    if (this.user.rang === "manager") {
      result = true;
    } else {
      result = false;
    }
    console.log("validateRoot", result);
    return result;
  }

  sendMail() {
    var mailer = require("nodemailer");
    var smtpTransport = mailer.createTransport({
      direct: true,
      host: 'smtp.yandex.ru',
      port: 465,
      auth: {
        user: "system@neurobis.ru",
        pass: "Qwerty282"
      },
      secure: true
    });

    var mail = {
      from: "Система neurobis <system@neurobis.ru>",
      to: this.ctx.request.body.email,
      subject: "Регистрация в сервисе neurobis scaner",
      text: `Привет! Поздравляю с регистрацией в сервисе, ниже логин и пароль! 
      Логин: ${this.login}
      Пароль: ${this.password}`,
      html: ""
    };

    smtpTransport.sendMail(mail, function(error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log("Message sent: " + response.message);
      }

      smtpTransport.close();
    });
  }

  async saveInBase() {
    console.log("saveInBase");
    this.password = gen();
    let newUser = await User.addUser(this.user._id, this.ctx.request.body.email, this.password);
    this.login = newUser.login;
    return newUser;
  }
}

module.exports = newUser;
