
const express = require('express');
const router = express.Router();
const swal = require('sweetalert2')

//var JSAlert = require("js-alert");
var passport = require('passport');
function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        } else {
            req.flash('mensagem', 'Você não esta logado!');
            res.redirect('/?fail=true');
        }
    }
}
router.get('/', function (req, res) {

    if (req.query.fail) {
        res.render('../login', { message: req.flash('mensagem') });
    } else {
        res.render('../login', { message: null });
    }
});
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/login', failureRedirect: '?fail=true', failureFlash: true
    })
);
router.post('/novo', function (req, res) {
    req = req.body.cpf;
    const controller = require('../controllers/Controller')
    controller.post(req, function (error, result) {
        if (error) {
            console.log(error);
            res.send(error);
            // res.render('../views/pages/menu/index', { message: error });
        }

    });
    // passport.authenticate('local', {
    //     successRedirect: '/novo', failureRedirect: '?fail=true', failureFlash: true
    // });
});

router.get('/novo', function (req, res) {
    console.log(req.body);
    // const controller = require('../controllers/Controller')
    // console.log(req.body);
    // controller.post(function (req, res) {
    //         console.log(req);
    // });
    //router.post('/', controller.post);
    res.render('../views/pages/menu/index', { message: null });
});

/**
 * Evitar acesso anomino
 * 
 */
router.get('/login', authenticationMiddleware(), function (req, res) {
    //res.render('../views/pages/index',{ message: null });
    res.render('../views/pages/menu/index', { message: null });
});
router.get('/forms', authenticationMiddleware(), function (req, res) {
    res.render('../views/pages/menu/forms', { message: null });
});
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });

});

router.get('/', function (req, res, next) {
    res.render('../login/index');
});
router.get('/register', function (req, res, next) {
    res.render('../login/register');
});
router.get('/forgot', function (req, res, next) {
    res.render('../login/forgot');
});
router.get('/inserir', function (req, res, next) {
    //res.render('../views/pages/index');
    res.render('../views/pages/menu/index');

});
router.post('/reset', function (req, res, next) {
    res.render('../login/reset');
});
module.exports = router;