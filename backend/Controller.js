const repo = require("./repo")
const jwt = require("jsonwebtoken")
const model = require("./model")
const Login = (req, res) => {
    let token = jwt.sign(req.body, 'secret', { expiresIn: '3hr' })
    res.send({ status: 200, token: token, message: "Logged In...", session: req.session.passport.user.id })
}

const Authenticate = (req, res) => {
    let result = jwt.verify(req.headers.authorization, 'secret', (err, decode) => {
        if (decode !== undefined)
            return decode
        else
            return err
    })
    if (result instanceof Error)
        res.send({ status: 401, isAuthenticated: false })
    else {
        if (req.isAuthenticated())
            res.send({ status: 200, isAuthenticated: true })
        else
            res.send({ status: 401, isAuthenticated: false })
    }

}

const Home = (req, res) => {
    res.send("Hello")
}

const SignUp = (req, res) => {
    repo.SignUp(req.body).then(data => res.send(data))
}

const Logout = (req, res) => {
    req.logout((err) => {
        if(req.session)
        req.session.destroy()
        if (!err) {
            res.send({ msg: 'loggedout', status: 200 })
        }
    })
}

module.exports = { Login, Home, SignUp, Authenticate, Logout }

