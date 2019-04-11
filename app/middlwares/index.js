const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const md5 = require('md5');
const koaRequest = require('koa-http-request');
const env = require("../../config");

const authUser = require("./authUser");

app.use(bodyParser());

app.use(koaRequest({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
  }));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', env.FRONTENT_URI);
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    ctx.set('Access-Control-Allow-Credentials', "true");

    // ctx.body = true
    await next();
});

app.use(async (ctx, next) => {    
    let result = await authUser.main(ctx, next);
    ctx = result.ctx;
    await result.next;
})

app.use(serve('public'));
app.use(logger());

module.exports = app;