const env = require("../../config");
const queryString = require('query-string');
const UserSchema = require("../schemas/user");
const easyvk = require('easyvk')
const Guid = require("guid");
const CoinBalanceSchema = require("../schemas/coin_balance");
const RubBalanceSchema = require("../schemas/rub_balance");

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
        this.ctx.type = "html";
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
        else this.validateUser(resultUser);
    }

    badAuth() {
        this.ctx.redirect(`${env.FRONTENT_URI}/wrongpass`);
    }

    async addNewUser(repo) {
        let info = await easyvk({
            access_token: repo.access_token,
            fields: "first_name,last_name,photo_200_orig",
        });

        let {
            user_id,
            first_name,
            last_name,
            photo_200_orig,
            access_token
        } = info.session;

        let newUser = new UserSchema({
            vk_id: user_id,
            login: first_name + ' ' + last_name,
            photo: photo_200_orig,
            date: new Date(),
            access_token,
            sid: Guid.raw(),
        });

        let saveResult = await newUser.save();
        this.addUserBalaces(saveResult._id);
        this.ctx.body = require("../templates/goodAuth").render({
            sid: saveResult.sid
        });
    }

    async addUserBalaces(userId) {
        const balanceTemplate = {
            send_adress: "",
            user_id: userId,
            count: 0,
        }
        const newRub = new RubBalanceSchema(balanceTemplate);
        const newCoin = new CoinBalanceSchema(balanceTemplate);
        newRub.save();
        newCoin.save();
    }

    async validateUser(user) {
        this.ctx.body = require("../templates/goodAuth").render({
            sid: user.sid
        });
    }
}

module.exports = new OAuthVK;