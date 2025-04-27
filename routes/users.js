const router = require("express").Router()
const { createuser, getlockedstages, unlockstages, listusers, resetdatabase } = require("../controllers/user")
const { protectplayer, protectteacher } = require("../middleware/middleware")

router
    .get("/getlockedstages", protectplayer, getlockedstages)
    .get("/listusers", protectteacher, listusers)
    .get("/resetdatabase", protectteacher, resetdatabase)
    .post("/createuser", createuser)
    .post("/unlockstages", protectplayer, unlockstages)

module.exports = router;