const Router = require("koa-router");
const axios = require("axios");
let md5 = require('md5');
const http = require('http');
const env = require("../../config");


const app = require("../middlwares");
const OAuthVK = require("../routes/OAuthVK");

const router = new Router();


router.post("/login", async (ctx, next) => {
  let user = ctx.request.body;
  user.password = md5(user.password);
  await User.loginUser(user).then(result => {
    if (result) {
      ctx.set("Set-Cookie", "sid=" + result.sid);
      ctx.body = {
        statusLogin: true,
        rang: result.res.rang
      };
    } else {
      ctx.body = {
        statusLogin: false
      };
    }
  });
  await next();
});

router.get("/auth", async (ctx, next) => {
  await OAuthVK.main(ctx);
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;