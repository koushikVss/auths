const passport = require("passport")
const { Login,Home,SignUp,Authenticate,Logout } = require("./Controller")

const router = require("express").Router()

router.post('/register', SignUp);
router.post('/login',passport.authenticate('local'),Login)
router.post('/authenticate',Authenticate)
router.post('/logout',Logout)
// router.get("/home",Authenticate,Home)
// router.get()


module.exports = router

