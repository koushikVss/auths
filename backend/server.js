const express = require("express")
const app = express()
const logger = require("morgan")
const  cookieParser = require("cookie-parser")

const session = require("express-session")
const passport = require("passport")
const model = require("./model")
const dbstore = require("connect-mongodb-session")(session)
const repo = require("./repo")
const routes = require("./routes")
const DB_URI = 'mongodb://localhost:27017/AuthenticationDB'
const mongoose = require("mongoose")
const bodyParser =require("body-parser")
const {v4:uuidv4} = require("uuid")
const store = new dbstore({
    uri: DB_URI,
    collection: 'Sessions'
})
const cors = require("cors")

mongoose.connect(DB_URI)
mongoose.connection.once("open", (err) => {
    if (!err)
        console.log("Conneted to AuthenticationDB");
    else
        console.log(err);
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(express.json())
app.use(logger('dev'))
app.use(session({
    secret:'secret',
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*25,
        httpOnly:true
    },
    store:store,
    resave:false
}))
app.use(cookieParser('secret'))
app.use(passport.initialize())
app.use(passport.session())


passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    model.findById({_id:id}, function (err, user) {
        done(err, user)
    })
})

passport.use(repo.Login())


app.use("/api",routes)

const  port = 4001
app.listen(port,()=>{
    console.log("Auth server on 4001...");
})






