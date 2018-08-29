const bcryptjs = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy

module.exports = function (passport) {

    function findUser(username, callback) {
        global.db.collection("entidade").findOne({ usuarios: { $elemMatch: { username: username } } }, function (err, result) {
            callback(err, result);
        });
    }

    function findUserById(id, callback) {
        const ObjectId = require("mongodb").ObjectId;
        global.db.collection("entidade").findOne({ _id: ObjectId(id) }, (err, result) => {
            callback(err, result);
        });
    }
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        findUserById(id, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        (req, username, password, done) => {

            findUser(username, (err, user) => {


                if (err) { return done(err, req.flash('mensagem', 'Erro na autenticação do usuário')) }

                // usuário inexistente
                if (!user) { return done(null, false, req.flash('mensagem', 'Usuário ou Senha incorretos!')) }
                //procurando o usúario 
                for (let i = 0; i < user.usuarios.length; i++) {
                    if (user.usuarios[i].username == username) {
                        // comparando as senhas
                        bcryptjs.compare(password, user.usuarios[i].password, (err, isValid) => {
                            if (err) { return done(err) }
                            if (!isValid) { return done(null, false, req.flash('mensagem', 'Usuário ou Senha incorretos!')) }
                            return done(null, user)
                        })
                    }
                }

            })
        }
    ));
}
