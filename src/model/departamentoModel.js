import { Schema, Types } from "mongoose";
import { EmpresaSchema } from "./empresaModel";

export const DepartamentoSchema = new Schema({
    uid: Types.ObjectId,
    name: String,
    empresa: { type: EmpresaSchema },
    ativo: Boolean
})