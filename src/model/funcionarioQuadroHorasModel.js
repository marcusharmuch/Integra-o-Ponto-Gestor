
var mongoose = require('mongoose');
QuadroHorasSchema = require('../model/quadroHorasSchema');

var Schema = mongoose.Schema;

const FuncionarioQuadroHorasSchema = new Schema({
    id: Number,
    data_vigencia: Date,
    quadro_de_hora: QuadroHorasSchema
});