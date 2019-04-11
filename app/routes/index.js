const Router = require("koa-router");
const axios = require("axios");
let md5 = require('md5');
const http = require('http');
const env = require("../../config");


const app = require("../middlwares");
const OAuthVK = require("../routes/OAuthVK");

const router = new Router();


router.get("/login", async (ctx, next) => {
  ctx.body = ctx.state;
});

router.get("/user/checkAuth", async (ctx, next) => {
  await OAuthVK.main(ctx);
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;