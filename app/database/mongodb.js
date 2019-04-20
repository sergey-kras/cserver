const mongoose = require('mongoose');

var uri = 'mongodb+srv://admin:Qwerty282@cluster0-zaqch.mongodb.net/vkcoin';

mongoose.connect(uri, {
    useNewUrlParser: true
}).then(() => {
    console.log("connect to database parser");
}).catch((e) => {
    console.log(e);
});;

module.exports = mongoose;