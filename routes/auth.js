const router = require("express").Router()
const { authlogin, authteacherlogin, authsuperadminlogin } = require("../controllers/auth")
// const { protectsuperadmin } = require("../middleware/middleware")

router
    .get("/login", authlogin)
    .get("/teacherlogin", authteacherlogin)
    .get("/superadminlogin", authsuperadminlogin)

module.exports = router;
