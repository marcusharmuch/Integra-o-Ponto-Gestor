
const express = require('express');
const router = express.Router();
const swal = require('sweetalert2')

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

router.get('/novo', function (req, res) {
    console.log(req);
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
    /**
     * Variáveis globais para paramentros do sistema, contidas no usúario mLab.
     */
    global.mongo_local = req.user.config.mongo;
    global.aise = req.user.config.aise;
    console.log(global.aise)
    global.token = req.user.config.token;
    global.url_api = req.user.config.rota_api;
    console.log(global.url_api);
    global.url_gestor = req.user.config.api_gestor;
    console.log(global.url_gestor);
    global.entidade = req.user.nome;
    console.log(global.entidade);

    res.render('../views/pages/menu/index', { message: global.usuario });
});
router.get('/forms', authenticationMiddleware(), function (req, res) {
    res.render('../views/pages/menu/forms');
});
router.get('/alterar', authenticationMiddleware(), function (req, res) {
    res.render('../views/pages/menu/alterar');
});
router.get('/adicionar_todos', authenticationMiddleware(), function (req, res) {
    res.render('../views/pages/menu/adicionar_todos');
});
router.get('/adicionar_justificativas', authenticationMiddleware(), function (req, res) {
    res.render('../views/pages/menu/adicionar_justificativas');
});

router.get('/principal', authenticationMiddleware(), function (req, res) {
    res.render('../views/pages/menu/principal');
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
router.get('/adiconar', function (req, res, next) {
    //res.render('../views/pages/index');
    res.render('../views/pages/menu/index');

});
router.post('/reset', function (req, res, next) {
    res.render('../login/reset');
});
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/login', failureRedirect: '?fail=true', failureFlash: true
    })
);
router.post('/novo', function (req, res, next) {
    var cpf = req.body.cpf.replace(/\D+/g, '');
    req.cpf = cpf;
    const controller = require('../controllers/Controller')
    controller.post(req, function (error, result) {
        if (error) {
            res.status(error).send(result);
        } else {
            //console.log(result);
            res.status(201).send(result);

        }

    });
    // passport.authenticate('local', {
    //     successRedirect: '/novo', failureRedirect: '?fail=true', failureFlash: true
    // });
});
router.post('/adicionar_todos', function (req, res, next) {
    /**
     * define a operação:
     * 0 = funcionários,
     * 1 = justificativas
     */
    req = 0;
    const controller = require('../controllers/Controller')
    controller.post(req, function (error, result) {
        if (error) {
            res.status(error).send(result);
        } else {
            //console.log(result);
            res.status(201).send(result);

        }

    });
});
router.post('/adicionar_justificativas', function (req, res, next) {
    /**
     * define a operação:
     * 0 = funcionários,
     * 1 = justificativas
     */
    req = 1;
    const controller = require('../controllers/Controller')
    controller.post(req, function (error, result) {
        if (error) {
            res.status(500).send(error);
        } else {
            //console.log(result);
            res.status(201).send(result);

        }

    });
});
router.route('/mongo').post(function (req, res) {

    PontoModel = require('../model/pontoModel.js');
    PontoModel.replicacao_mongo(req, function (error, result) {
        if (error) {
            res.status(400).send(error);
            return;
        } else {
            res.status(200).send(result);
        }
    });

});
router.patch('/alterar', function (req, res, next) {
    var cpf = req.body.cpf.replace(/\D+/g, '');
    req.cpf = cpf;
    const controller = require('../controllers/Controller')
    controller.patch(req, function (error, result) {
        if (error) {
            res.status(400).send(error);
            return
        } else {
            console.log(result);
            res.status(200).send(result);

        }

    });
});

module.exports = router;