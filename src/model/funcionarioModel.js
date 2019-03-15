var mongoose = require('mongoose');
DepartamentoSchema = require ('../model/departamentoModel');
EmpresaSchema = require ('../model/empresaModel');
FuncionarioQuadroHorasSchema = require ('../model/funcionarioQuadroHorasModel');

mongoose.set('useCreateIndex', true)

var Schema = mongoose.Schema;

const FuncionarioSchema = new Schema({
    uid: {type: String, index: true, unique:true},
    cpf: { type: String, index: true, unique: true },
    cracha: Number,
    data_admissao: Date,
    data_demissao: Date,
    name: String,
    pis: String,
    registro_folha: String,
    rg: String,
    nacionalidade: String,
    nome_da_mae: String,
    nome_do_pai: String,
    estado_civil: String,
    conjuge: String,
    nascimento: String,
    ctps: String,
    cnh: String,
    certidao_militar: String,
    tipo_sanguineo: String,
    escolaridade: String,
    observacoes: String,
    empresa: EmpresaSchema,
    departamento: DepartamentoSchema,
    last_quadro_de_horas: FuncionarioQuadroHorasSchema
});

module.exports = mongoose.model(global.entidade, FuncionarioSchema);

/**
 * Para fazer o update ou inclusão de um funcionário pode ser fazer da seguinte forma:
 *
 * FuncionarioModel.update({ uid: "115ae249-b476-4702-a07c-eb15ff02e39e" }, funcionario, { upsert: true });
 */
