/**
 * @author <marcus@publitechsistemas.com.br>
 */
var moment = require('moment');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
var flash = require('connect-flash');
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
app.use(express.static("."));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());
require('./auth')(passport);
app.use(session({
    store: new MongoStore({
        host: '127.0.0.1',
        port: '32765',
        db: 'session',
        url: 'mongodb://localhost:32765/ponto',
        //db: global.db,
        ttl: 15 * 60 // = 30 minutos de sessão
    }),
    secret: '123',//configure um segredo seu aqui
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

moment.locale('pt-BR');


//Conexao com MongoDb Atlas
// var MongoClient = require('mongodb').MongoClient;
// var uri = "mongodb+srv://marcusharmuch:cpd4522@cluster0-6lzy5.mongodb.net/test?retryWrites=true";
// MongoClient.connect(uri, function(err, client) {
//    if(err) {
//         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//    }
//    console.log('Conectado do Mongodb Atlas On Line');
//    const collection = client.db("test").collection("devices");
//    //collection.insert({"funcionario":{"name":"ETEVALDO ALVES NETO", "cpf":"000.000.000-00"}})
//    // perform actions on the collection object
//    client.close();
// });
//Rotas
const index = require('./routes/index');
const getRoute = require('./routes/Route');
const postRoute = require('./routes/Route');
//serve static files from template
app.use('/', index);
app.use('/', getRoute);
app.use('/', postRoute);


module.exports = app;
