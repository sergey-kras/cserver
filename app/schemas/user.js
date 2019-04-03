const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const User = new Schema({
    name: String,
    id: Number,
    login: String,
    mail: String,
    password: String,
    rang: String,
    onlineStatus: Boolean,
    subscribe: Date,
    sid: String,
    blackIp: Array,
    whiteIp: Array,
});

const UserTable = model('users', User);
module.exports = UserTable;