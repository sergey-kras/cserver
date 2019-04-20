const Router = require("koa-router");
const axios = require("axios");
let md5 = require('md5');
const http = require('http');
const env = require("../../config");


const app = require("../middlwares");
const OAuthVK = require("../routes/OAuthVK");
const UserSiteTransactions = require("../routes/UserSiteTransactions");
const User = require("../routes/User");


const router = new Router();


router.get("/user/balance/:type", async (ctx, next) => {
  let currency = ctx.params.type;
});

router.get("/test", async (ctx, next) => {
  ctx.body = '234234324';
  next()
});

router.get("/user/info", User.info.bind(User));

router.get("/user/balances", async (ctx, next) => {
  await User.balances(ctx);
});

router.get("/user/transactions", async (ctx, next) => {
  await User.transactions(ctx);
});

router.get("/user/site/transactions/:type", async (ctx, next) => {
  await UserSiteTransactions.get(ctx);
});

router.get("/user/checkAuth", async (ctx, next) => {
  await OAuthVK.main(ctx);
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;