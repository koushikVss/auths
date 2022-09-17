const model = require("./model")
const bcrypt = require("bcryptjs")
const LocalStrategy = require("passport-local").Strategy

const Login = () => {
    return new LocalStrategy({ usernameField: "email", passwordField: 'password' }, function (username, password, done) {
        model.findOne({ email: username }, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, { message: "Incorrect email" })
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
        })
    }
    )
}

const SignUp = (data) => {
    // console.log(data)
    return new Promise((resolve, reject) => {
        model.findOne({ email: data.email }, (err, user) => {
            if (err)
                reject(err)
            else if (!user) {
                data.password = bcrypt.hashSync(data.password,10)
                let newmodel = new model(data)
                newmodel.save((err) => {
                    if (!err)
                        resolve({ status: 200, message: 'User registered' })
                    else
                        reject(err)
                })
            }
            else {
                resolve({ status: 400, message: "User already registered..try logging in" })
            }
        })
    })
}


module.exports = { Login, SignUp }

