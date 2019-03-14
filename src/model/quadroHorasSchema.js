var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const QuadroHorasSchema = new Schema({

    hora_virada: Date,
    name: String,
    tipo: String,
    use_holiday: Boolean,
    folgas_especiais: Number,
    ativo: Boolean,
    ch: Boolean,
    marcacao_automatica_intervalo: Boolean,
    tolerancia: {
        tolerancia_fixa: Boolean,
        tolerancia_fixa_entrada: Number,
        tolerancia_fixa_saida: Number,
        tolerancia_global_extra: Number,
        tolerancia_global_falta: Number
    },
    horario: {
        escalas: [
            {
                tipo: String,
                hora_virada: Date,
                ordem: Number
            }
        ]
    },
    intervalo: Number

});