'use strict'
const { default: mongoose } = require("mongoose")
const {countConnect} = require('../utils/check.connect')
const {db: {host, name, port }} = require("../configs/config.mongodb")

const connectString = `mongodb://${host}:${port}/${name}`
console.log("connectString ", connectString)

class Database {

    constructor(){
        this.connect(); 
    }
    connect(type = 'mongodb'){
        if(1 === 1) {
        mongoose.set('debug', true)
        mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
        .then(() => {
            console.log(`Connected Mongodb Successfully Pro`)
        } )
        .catch(err => console.log(`Error Connect ${err}`))  
    }
    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database(); 
        }
        return Database.instance; 
    }
}
const instanceMongodb = Database.getInstance(); 
module.exports = instanceMongodb; 
