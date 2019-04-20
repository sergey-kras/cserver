const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const userSiteTransaction = new Schema({
    date: Date,
    user_id: String,
    type: String,
    count: Number,
    status: String,
    path: String,
});

const userSiteTransactionsTable = model('user_site_transactions', userSiteTransaction);
module.exports = userSiteTransactionsTable;

