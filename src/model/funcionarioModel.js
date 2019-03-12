import { model, Schema, Types } from "mongoose";
import { DepartamentoSchema } from "./departamentoModel";
import { EmpresaSchema } from "./empresaModel";
import { FuncionarioQuadroHorasSchema } from "./funcionarioQuadroHorasModel";

const FuncionarioSchema = new Schema({
    uid: Types.ObjectId,
    cpf: { type: String, index: true, unique: true },
    cracha: String,
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

export const FuncionarioModel = model('Funcionario', FuncionarioSchema);

/**
 * Para fazer o update ou inclusão de um funcionário pode ser fazer da seguinte forma:
 *
 * FuncionarioModel.update({ uid: "115ae249-b476-4702-a07c-eb15ff02e39e" }, funcionario, { upsert: true });
 */
