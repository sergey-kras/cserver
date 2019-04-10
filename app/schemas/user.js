const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const User = new Schema({
    vk_id: String,
    photo: String,
    login: String,
    sid: String,
    date: Date,
    access_token: String,
});

const UserTable = model('users', User);
module.exports = UserTable;