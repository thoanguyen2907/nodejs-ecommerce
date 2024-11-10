'use strict'
const { default: mongoose } = require("mongoose")

const connectString = 'mongodb://localhost:27017/shopify'
 mongoose.connect(connectString)
    .then(() => console.log("Connected Mongodb Successfully"))
    .catch(err => console.log(`Error Connect ${err}`));
    
if(1 === 1) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}
module.exports = mongoose; 