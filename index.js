require('dotenv').config();
const app = require('./app/routes');
console.log(process.env.CLIENT_SECRET);   
app.listen(4200, () => { console.log('App listen on 4200');});