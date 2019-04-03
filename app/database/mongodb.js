const mongoose = require('mongoose');
// const uri = "mongodb+srv://neurobis:<Qwerty282>@cluster0-5083p.azure.mongodb.net/test?retryWrites=true";

var uri = 'mongodb+srv://neurobis0:piwdis-Deqkiq-9fojcu@cluster0-5083p.azure.mongodb.net/neurobis?retryWrites=true';

mongoose.connect(uri).then(() => {
    console.log("connect to database parser");
})
    .catch((e) => {
        console.log(e);
    });;

module.exports = mongoose; 