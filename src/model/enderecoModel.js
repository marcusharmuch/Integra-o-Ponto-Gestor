var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const EnderecoSchema = new Schema({
    cep: String,
    city: String,
    complement: String,
    country: String,
    number: String,
    state: String,
    street: String,
    district: String
});
