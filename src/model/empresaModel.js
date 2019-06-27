var mongoose = require('mongoose');
EnderecoSchema = require('../model/enderecoModel');
ContatoSchema = require('../model/contatoModel');

var Schema = mongoose.Schema;

const EmpresaSchema = new Schema({
    uid: String,
    name: String,
    nome_fantasia: String,
    cnpj: String,
    cei: String,
    cpf: String,
    inscricao_estadual: String,
    address: EnderecoSchema ,
    contact: ContatoSchema ,
    codigo_registro_folha: String,
    ativo: Boolean
});
