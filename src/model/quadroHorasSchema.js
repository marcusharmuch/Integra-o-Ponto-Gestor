import { Schema } from "mongoose";

export const QuadroHorasSchema = new Schema({

    hora_virada: Date,
    name: String,
    tipo: String,
    use_holiday: Boolean,
    folgas_especiais: Integer,
    ativo: Boolean,
    ch: Boolean,
    marcacao_automatica_intervalo: Boolean,
    tolerancia: {
        tolerancia_fixa: Boolean,
        tolerancia_fixa_entrada: Integer,
        tolerancia_fixa_saida: Integer,
        tolerancia_global_extra: Integer,
        tolerancia_global_falta: Integer
    },
    horario: {
        escalas: [
            {
                tipo: String,
                hora_virada: Date,
                ordem: Integer
            }
        ]
    },
    intervalo: Integer

});