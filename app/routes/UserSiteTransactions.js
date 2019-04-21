const env = require("../../config");
const queryString = require('query-string');
const userSiteTransactions = require("../schemas/userSiteTransactions");
const user = require("../schemas/user");
const errors = require("../errors");

class UserSiteTransactions {
    constructor() {}

    async get(ctx) {
        this.ctx = ctx;
        let {
            _id
        } = this.ctx.state.user;
        let transactions = await userSiteTransactions.find({ user_id: _id });
        transactions = transactions.map(item => {
            let { date, type, count, status, path } = item;
            return item = { date, type, count, status, path };
        });
        if(transactions != []) return ctx.body = transactions;
        else return ctx.body = errors.EMPTY_TRANSACTIONS;
    }


}

module.exports = new UserSiteTransactions;