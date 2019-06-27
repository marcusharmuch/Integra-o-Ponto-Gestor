var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContatoSchema = new Schema({
    email: String,
    name: String,
    phone: String,
    cpf: String
});
