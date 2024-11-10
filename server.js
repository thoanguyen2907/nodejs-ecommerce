const app = require("./src/app");


const server = app.listen(3055, () => {
    console.log(`service is running with port ${process.env.DEV_APP_PORT} `)
})

// process.on("SIGINT", () => {
//     server.close(() => console.log("Exit server express")) 
// })