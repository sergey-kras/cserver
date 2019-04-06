const newUser = require("./newUser");
const referersProvider =  require("./referersProvider");
const Router = require("koa-router");
const router = new Router();
const User = require("../database/user");
const app = require("../middlwares");
let md5 = require('md5');

router.options("/newUser", async (ctx, next)=>{
  ctx.body = true;
  await next();
});

router.post("/login", async (ctx, next) => {
  let user = ctx.request.body;
  user.password = md5(user.password);
  await User.loginUser(user).then(result => {
    if (result) {
      // ctx.set("Set-Cookie", "sid=" + result.sid + ";domain=neurobis.now.sh");
      ctx.set("Set-Cookie", "sid=" + result.sid);
      // ctx.cookies.set('sid', result.sid, { signed: true, path: '/'});
      ctx.body = { statusLogin: true, rang: result.res.rang };
      //ctx.send(200,{ statusLogin: true, rang: result.res.rang });
    } else {
      // ctx.send(200,{ statusLogin: false });
      ctx.body = { statusLogin: false };
    }
  });
  await next();
});

router.get("/info", async (ctx, next) => {
  let sid = ctx.cookies.get("sid");
  console.log(sid);
  await User.checkSession(sid).then(result => {
    ctx.body = {
      login: result[0].login,
      rang: result[0].rang
    };
  });
  await next();
});

router.post("/newUser", async (ctx, next) => {
  let createUser = new newUser(ctx.state.user, ctx);
  ctx.body = await createUser.main();
});

router.get("/referrers", async (ctx, next) => {
  let referer = new referersProvider(ctx);
  ctx.body = await referer.getUsers();
});

router.get("/users", async (ctx, next) => {
  let UserSchema = require("../schemas/user");
  let sid = ctx.cookies.get("sid");
  ctx.body = {users: await UserSchema.find({}), sid};
});

router.delete("/referrers/:id", async (ctx, next) => {
  let referer = new referersProvider(ctx);
  ctx.body = await referer.removeUser();
});

router.patch("/referrers/:id", async (ctx, next) => {
  let referer = new referersProvider(ctx);
  ctx.body = await referer.resetThePassword();
});

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
