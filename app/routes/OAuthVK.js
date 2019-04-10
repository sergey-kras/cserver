const env = require("../../config");
const queryString = require('query-string');
const UserSchema = require("../schemas/user");
const easyvk = require('easyvk')
const Guid = require("guid");

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
       
        if (repo.access_token) await this.goodAuth(repo);
        else await this.badAuth();
        return this.ctx;
    }

    async goodAuth(repo) {
        let resultUser = await UserSchema.findOne({
            vk_id: repo.user_id
        });
        if (!resultUser) await this.addNewUser(repo);
        this.ctx.redirect(`${env.FRONTENT_URI}/private?${repo.access_token.substring(0,10)}`, '', 302);
    }

    badAuth() {
        this.ctx.redirect(`${env.FRONTENT_URI}/wrongpass`);
    }

    async addNewUser(repo) {
        let info = await easyvk({
            access_token: repo.access_token,
            fields: "first_name,last_name,photo_200_orig",
        });

        let { user_id, first_name, last_name, photo_200_orig, access_token } = info.session;

        let newUser = new UserSchema({
            vk_id: user_id,
            login: first_name + ' ' + last_name,
            photo: photo_200_orig,
            date: new Date(),
            access_token,
            sid: Guid.raw(),
        });

        let saveResult = await newUser.save();
    }

    async validateUser(user) {
        console.log(user);
    }
}

module.exports = new OAuthVK;