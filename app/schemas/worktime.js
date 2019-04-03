const mongodb = require('../database/mongodb');
const model = require('mongoose').model;

const Schema = mongodb.Schema;

const WorkTime = new Schema({
    userId: Number,
    mon: {
        by: "10:00",
        to: "18:00"
    },
    tue: {
        by: "10:00",
        to: "18:00"
    },
    wen: {
        by: "10:00",
        to: "18:00"
    },
    thir: {
        by: "10:00",
        to: "18:00"
    },
    fry: {
        by: "10:00",
        to: "18:00"
    },
    sat: {
        by: "10:00",
        to: "18:00"
    },
    sun: {
        by: "10:00",
        to: "18:00"
    }
});

const UserTable = model('worktime', WorkTime);
module.exports = UserTable;