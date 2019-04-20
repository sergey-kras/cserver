const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const sell_coin_transaction = new Schema({
    date: Date,
    by_user_id: String,
    to_user_id: String,
    price_by_cion: Number,
    count: Number,
});

const sell_coin_transactionTable = model('sell_coin_transactions', sell_coin_transaction);
module.exports = sell_coin_transactionTable;