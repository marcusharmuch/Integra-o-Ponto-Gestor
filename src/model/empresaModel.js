import { Schema, Types } from "mongoose";
import { EnderecoSchema } from "./enderecoModel";
import { ContatoSchema } from "./contatoModel";

export const EmpresaSchema = new Schema({
    uid: Types.ObjectId,
    name: String,
    nome_fantasia: String,
    cnpj: String,
    cei: String,
    cpf: String,
    inscricao_estadual: String,
    address: { type: EnderecoSchema },
    contact: { type: ContatoSchema },
    codigo_registro_folha: String,
    ativo: Boolean
});