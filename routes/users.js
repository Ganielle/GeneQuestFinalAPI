const router = require("express").Router()
const { createuser, getlockedstages, unlockstages, listusers } = require("../controllers/user")
const { protectplayer, protectteacher } = require("../middleware/middleware")

router
    .get("/getlockedstages", protectplayer, getlockedstages)
    .get("/listusers", protectteacher, listusers)
    .post("/createuser", createuser)
    .post("/unlockstages", protectplayer, unlockstages)

module.exports = router;