import { Schema } from "mongoose";

export const ContatoSchema =  Schema({
    email: String,
    name: String,
    phone: String,
    cpf: String
});