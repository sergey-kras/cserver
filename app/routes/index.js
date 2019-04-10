const Router = require("koa-router");
const router = new Router();
const app = require("../middlwares");
const axios = require("axios");
let md5 = require('md5');
const http = require('http');


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
  let code = ctx.query.code;
  let accessToken = ctx.query.access_token;
  let repo = await ctx.get(`https://oauth.vk.com/access_token?client_id=6933029&client_secret=96LBXxmjF4n604Kqn6ao&redirect_uri=http://127.0.0.1:4200/auth&code=${code}`, null, { 'User-Agent': 'koa-http-request' });
  console.log(repo);
  if(repo.access_token) { ctx.redirect("http://localhost:3000") }
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;