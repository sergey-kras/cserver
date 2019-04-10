const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const md5 = require('md5');
const koaRequest = require('koa-http-request');


app.use(bodyParser());
app.use(koaRequest({
    json: true, //automatically parsing of JSON response
    timeout: 3000,    //3s timeout
    host: 'https://api.github.com'
  }));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', 'https://scan.neurobis.ru');
    // ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    ctx.set('Access-Control-Allow-Credentials', "true");

    // ctx.body = true;
    await next();
});

app.use(async (ctx, next) => {    
    // if (ctx.path !== '/login' && ctx.path !== '/users') {
    //     let sid = ctx.cookies.get('sid');
    //     let result = await User.checkSession(sid);
    //     console.log(result);
    //     ctx.state.user = result[0];
    //     if (result) await next();
    //     else ctx.body = {
    //         message: "Недостаточно прав"
    //     }
    // } else {
    //     await next();
    // }
    await next();
})

app.use(serve('public'));
app.use(logger());

module.exports = app;