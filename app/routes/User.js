const env = require("../../config");
const queryString = require('query-string');
const CoinBalanceSchema = require("../schemas/coin_balance");
const RubBalanceSchema = require("../schemas/rub_balance");
const user = require("../schemas/user");
const errors = require("../errors");

class User {
    constructor() {}

    async info(ctx) {
        let {
            vk_id,
            login,
            photo,
            date
        } = ctx.state.user;
        ctx.body = {
            vk_id,
            login,
            photo,
            date
        };
    }

    async balances(ctx) {
        this.ctx = ctx;
        let {
            _id
        } = this.ctx.state.user;
        let coins = await CoinBalanceSchema.find({
            user_id: _id
        });
        coins._id = null;
        let rubs = await RubBalanceSchema.find({
            user_id: _id
        });
        rubs = rubs[0];
        coins = coins[0];

        return this.ctx.body = {
            rubs: {
                count: rubs.count,
                send_adress: rubs.send_adress
            },
            coins: {
                count: coins.count,
                send_adress: coins.send_adress
            },
        };
    }
}

module.exports = new User;