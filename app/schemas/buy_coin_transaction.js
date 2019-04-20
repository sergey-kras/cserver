const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const buy_coin_transaction = new Schema({
    date: Date,
    by_user_id: String,
    to_user_id: String,
    price_by_cion: Number,
    count: Number,
});

const buy_coin_transactionTable = model('buy_coin_transactions', buy_coin_transaction);
module.exports = buy_coin_transactionTable;