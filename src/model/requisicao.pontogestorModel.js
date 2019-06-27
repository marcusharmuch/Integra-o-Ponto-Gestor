/**
 * @author  <marcusharmuch@publitechsistemas.com.br>
 */
module.exports.requisicao_pontogestor = requisicao_pontogestor;
/**
 * 
 * @param {*} req (resultado da consulta do aise para inserir dados no ponto) 
 * @param {*} callback (retorno)
 */
function requisicao_pontogestor(req, callback) {
    envia_pontogestor(req, function (problem, error, result) {
        callback(problem, error, result);
    });
}
function envia_pontogestor(req, callback) {

    listaerros = new Array();
    listagravados = new Array();
    for (let i = 0, p = Promise.resolve(listaerros); i < req.length; i++) {//i < req.lentght
        p = p.then(_ => new Promise(resolve => {
            //var nome = req[i].funcionario.name;
            //var cpf = req[i].funcionario.cpf;
            //var pis = req[i].funcionario.pis
            PontoModel = require('../model/pontoModel.js');
            var reqponto = JSON.stringify(req[i]);
            PontoModel.gravaFuncionario(reqponto, function (problem, error, result) {
                if (problem) {
                    callback(problem, null, null);
                    return;
                }
                if (error) {
                    req[i].funcionario.erro = JSON.parse(error);
                    listaerros.push(req[i]);
                    resolve(listaerros);
                } else if (result) {
                    listagravados.push(req[i]);
                    resolve(listagravados);
                }
                if (i == (req.length - 1)) {
                    //console.log(listaerros);
                    //console.log(listagravados);
                    callback(null, listaerros, listagravados);
                    return;
                }
            });
        }));
    }
}