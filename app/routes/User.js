const env = require("../../config");
const queryString = require('query-string');
const CoinBalanceSchema = require("../schemas/coin_balance");
const RubBalanceSchema = require("../schemas/rub_balance");
const user = require("../schemas/user");
const errors = require("../errors");

class User {
    constructor() {}

    async info(ctx) {
        this.ctx = ctx;
        let {
            vk_id,
            login,
            photo,
            date
        } = this.ctx.state.user;
        return this.ctx.body = {
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
        rubs._id = null;
        return this.ctx.body = {
            rubs,coins
        };
    }

    
}

module.exports = new User;