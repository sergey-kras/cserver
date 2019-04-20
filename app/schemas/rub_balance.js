const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const coin_balance = new Schema({
    send_adress: String,
    user_id: String,
    count: Number,
});

const coin_balanceTable = model('rub_balances', coin_balance);
module.exports = coin_balanceTable;