const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const orders = new Schema({
    date: Date,
    user_id: String,
    type: String,
    count: Number,
    price_by_cion: String,
    status: String
});

const ordersSchema = model('orders', orders);
module.exports = ordersSchema;