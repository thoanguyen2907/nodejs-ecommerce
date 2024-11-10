'use strict'
const { default: mongoose } = require("mongoose")
const os = require("os")
const process = require("process") 

const _SECONDS = 5000

const countConnect = () => {
const numConnection = mongoose.connections.length
console.log(`Number of connections ${numConnection}`)
}

// check overload connect 
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length; 
        const numCores = os.cpus().length; 
        const memoryUsage = process.memoryUsage().rss
        // example maximum number of connections based on number of cores
        const maxConnections = numCores * 5
        if(numConnection >maxConnections)
        {
            console.log(`Connections overload detected!`)
        }
    }, _SECONDS) // monitor every 4 seconds
}
module.exports = {
    countConnect,
    checkOverload
}