const router = require("express").Router()
const { createteacher, listteachers, deleteteacher } = require("../controllers/staffuser")
const {protectteacher} = require("../middleware/middleware")

router
    .get("/listteachers", protectteacher, listteachers)
    .post("/createteacher", protectteacher, createteacher)
    .post("/deleteteacher", protectteacher, deleteteacher)

module.exports = router;