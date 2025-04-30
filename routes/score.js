const router = require("express").Router()
const { savescore, getscore, getleaderboard, getscorehistory } = require("../controllers/score")
const { getviewanswer } = require("../controllers/answer")
const { protectplayer, protectteacher } = require("../middleware/middleware")

router
    .get("/getscore", protectteacher, getscore)
    .get("/getleaderboard", protectplayer, getleaderboard)
    .get("/getscorehistory", protectplayer, getscorehistory)
    .get("/getviewanswer", protectplayer, getviewanswer)
    .post("/savescore", protectplayer, savescore)

module.exports = router;
