const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const Referer = new Schema({
    userId: String,
    userRefererId: String
});

const RefererTable = model('referers', Referer);
module.exports = RefererTable;