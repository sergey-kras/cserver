const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const User = new Schema({
    vk_id: String,
    login: String,
    password: String,
    sid: String
});

const UserTable = model('users', User);
module.exports = UserTable;