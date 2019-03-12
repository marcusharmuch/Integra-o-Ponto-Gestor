import { Schema } from "mongoose";
import { QuadroHorasSchema } from "./quadroHorasSchema";

export const FuncionarioQuadroHorasSchema = new Schema({
    id: Integer,
    data_vigencia: Date,
    quadro_de_hora: QuadroHorasSchema
});