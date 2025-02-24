const routers = app => {
    console.log("Routers are all available");

    app.use("/auth", require("./auth"))
    app.use("/score", require("./score"))
    app.use("/users", require("./users"))
    app.use("/staffuser", require("./staffuser"))
}

module.exports = routers