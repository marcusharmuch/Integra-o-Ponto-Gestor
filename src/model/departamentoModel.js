var mongoose = require('mongoose');
EmpresaSchema = require ('../model/empresaModel');

var Schema = mongoose.Schema;

const DepartamentoSchema = new Schema({
    uid: String,
    name: String,
    empresa: { type: EmpresaSchema },
    ativo: Boolean
})