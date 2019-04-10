const env = require("../../config");
const queryString = require('query-string');

class OAuthVK {
    constructor(){
        this.appSettings = {
            client_id: env.CLIENT_ID,
            client_secret: env.CLIENT_SECRET,
            redirect_uri: env.REDIRECT_URI,
        }
    }

    async main(ctx){
        this.ctx = ctx;
        this.appSettings.code = this.ctx.query.code;

        let qString = queryString.stringify(this.appSettings); console.log( this.appSettings, qString);
        let repo = await ctx.get(`https://oauth.vk.com/access_token?${qString}`, null, { 'User-Agent': 'koa-http-request' });
        if(repo.access_token) { return ctx.redirect("http://localhost:3000/private"); }
        else { return ctx.redirect("http://localhost:3000/wrongpass"); }
    }
}

module.exports = new OAuthVK;