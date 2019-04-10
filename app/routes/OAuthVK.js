const env = require("../../config");
const queryString = require('query-string');
const UserSchema = require("../schemas/user");

class OAuthVK {
    constructor() {
        this.appSettings = {
            client_id: env.CLIENT_ID,
            client_secret: env.CLIENT_SECRET,
            redirect_uri: env.REDIRECT_URI,
        }
    }

    async main(ctx) {
        this.ctx = ctx;
        this.appSettings.code = this.ctx.query.code;

        let qString = queryString.stringify(this.appSettings);
        let repo = await ctx.get(`https://oauth.vk.com/access_token?${qString}`, null, {
            'User-Agent': 'koa-http-request'
        });

        if (repo.access_token) this.goodAuth(repo);
        else this.badAuth();
        return this.ctx;
    }

    async goodAuth(repo) {
        let resultUser = await UserSchema.findOne({
            vk_id: repo.user_id
        });
        if (resultUser) await this.validateUser();
        else await this.addNewUser(repo);
        this.ctx.redirect(`${env.FRONTENT_URI}/private?${repo.access_token.substring(0,10)}`, '', 302);
    }

    badAuth() {
        this.ctx.redirect(`${env.FRONTENT_URI}/wrongpass`);
    }

    async addNewUser(repo) {
        let qObj = {
            user_ids: repo.user_id,
            fields: ["first_name", "last_name"],
            access_token: repo.access_token,
            v: "5.92",
        };
        let qString = queryString.stringify(qObj);
        let info = await this.ctx.get(`https://api.vk.com/method/users.get?`, null, {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0',
            'Origin': 'http://localhost:4200'
        });
        // let name = info.response[0].first_name + ' ' + info.response[0].last_name;
        console.log(`https://api.vk.com/method/users.get?` + qString, info);
        let newUser = new UserSchema({
            vk_id: repo.user_id,
            // login: name,
            password: String,
            sid: String
        });
    }

    async validateUser() {

    }
}

module.exports = new OAuthVK;