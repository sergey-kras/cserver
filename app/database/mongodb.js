const mongoose = require('mongoose');
// const uri = "mongodb+srv://neurobis:<Qwerty282>@cluster0-5083p.azure.mongodb.net/test?retryWrites=true";

var uri = 'mongodb+srv://vkcion:qwerty282@cluster0-zaqch.mongodb.net/vkcoin';

mongoose.connect(uri, { useNewUrlParser: true }).then(() => {
    console.log("connect to database parser");
})
    .catch((e) => {
        console.log(e);
    });;

module.exports = mongoose; 