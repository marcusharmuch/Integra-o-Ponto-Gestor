/**
 * @author <marcus@publitechsistemas.com.br>
 */
module.exports.gravaPontodb = gravaPontodb;
module.exports.consultaAise = consultaAise;
module.exports.criaRequisicao = criaRequisicao;
module.exports.gravaFuncionario = gravaFuncionario;
module.exports.consultaFuncionario = consultaFuncionario;
module.exports.replicacao_mongo = replicacao_mongo;
/**
 * 
 * @param {*} req (requisiçao para consulta, traz tb a configuração do aise)
 * @param {*} callback (retorno:error,result)
 */
function replicacao_mongo(req, callback) {
  Funcionario = require('../model/funcionarioModel');
  //db = require('../db');
  //var mongoose = require('mongoose');
  //mongoose.set('useFindAndModify', false)

  var async = require('async');
  var lista = JSON.parse(req);
  async.eachSeries(lista, function upsert(obj, done) {
    Funcionario.findOneAndUpdate({ uid: obj.uid }, obj, { upsert: true, new: true }, done);
  }, function allDone(err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, "Inserido/atualizado");
    }

  });
};
function consultaAise(req, callback) {

  /**
   * Obs.: Trocar essa conexao por um arquivo js.
   */

  // connect();
  // function connect() {
  //   var pg = require('pg');
  //   const connectionString = process.env.DATABASE_URL || global.aise;
  //   client = new pg.Client(connectionString);
  //   client.connect(function (error, client) {
  //     if (error) {
  //       console.log('Problema ao conectar ao Postgres. Verifique!', error);
  //       callback('Problema ao conectar ao Postgres!' + error, null);
  //       return 
  //     } else {
  //       console.log('Conectado ao Postgres');
  //     }
  //   })
  console.log(req);
  consulta_sql = require('../model/requisicao_aiseModel.js');
  consulta_sql.requisicao_aise(req, function (error, sql) {
    if (error) {
      callback(error, null);
      console.log('erro aki');
      return;
    } else {
      console.log("criou a requisicao para o aise");
      callback(null, sql);
      //return;
      // const query = client.query(sql, function (error, result) {
      //   if (error) {
      //     console.error('error running query', error);
      //     callback(error, null);
      //   } else {
      //     if (result.rowCount == 0 | result == null) {
      //       error = "Funcionário não encontrado no Aise."
      //       callback(error, null);
      //     } else {
      //       callback(null, result);
      //     }
      //   }
      // })
    }
  });
}
//}
function criaRequisicao(req, callback) {
  requisicao = require('../model/requisicao_pontoModel.js');
  requisicao.requisicao_ponto(req, function (error, result) {
    if (error) {
      callback(error, null);
    } else {
      //console.log(result);
      callback(null, result);

    }
  });
}
function gravaFuncionario(req, callback) {
  /**
   * Obs. Trocar essa requisicao feita ao  ponto gestor por um arquivo js.
   */
  //global.url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
  var request = require('request'), default_headers, url = global.url_gestor + "/v1/funcionarios/";
  default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
  request({
    url: url,
    headers: default_headers,
    method: global.method,
    body: req
  }, function (error, res, body) {
    /**
     * Obs. Tratar erros de acesso negado. StatusCode
     */
    if (!error && res.statusCode == 401) {
      console.log(res.statusMessage); globa
      callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
      return
    } else if (!error && res.statusCode == 201) {
      console.log("Gravado com Sucesso no Ponto Gestor");
      callback(null, null, res.statusMessage);
      return
    } else {
      console.log("Houve erros na gravaçao no Ponto Gestor");
      callback(null, res.body, null);
      return
    }
  });
};
function consultaFuncionario(req, callback) {
  console.log(req.rows.length)
  //for (let i = 0, p = Promise.resolve(listaerros); i < req.length; i++) {//i < req.lentght    
  var consulta = "?registro_folha=" + req.rows[0].registro_folha;
  /**
   * Obs. Trocar essa requisicao feita ao  ponto gestor por um arquivo js.
   */
  var request = require('request'), default_headers, url = global.url_gestor + ' /v1/funcionarios/' + consulta;
  default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
  request({
    url: url,
    headers: default_headers,
    method: 'GET',
  }, function (error, res, body) {
    /**
     * Obs. Tratar erros de acesso negado. StatusCode
     */
    if (error) {
      callback("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error, null, null);
    }
    if (!error && res.statusCode == 401) {
      console.log("Resultado da consulta:" + res.statusMessage);
      callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
    } else if (!error && res.statusCode == 200) {

      console.log("Resultado da consulta:" + res.statusCode);
      callback(null, null, res.statusCode);
    } else {
      console.log("Houve erros na consulta no Ponto Gestor. Verifique se o funcionário está cadastrado.");
      callback(null, res.body, null);
    }
  });
};
function gravaPontodb(req, callback) {
  console.log('Foi para gravar no mongo Local. Ver isso na apiaise');

  // var db = require('../db');
  // var PontoSchema = new db.Schema({
  //   tipo: String,
  //   funcionario: String,
  //   pis: String,
  //   requisicao: JSON,
  //   data: String
  // })
  // /**
  //  * "teste" deve ser substituído pelo usuário que fez a solicitação
  //  */
  // var usuario = global.usuario;
  // var Ponto = db.mongoose.models.teste || db.mongoose.model('teste', PontoSchema);
  // var instance = new Ponto();
  // /**
  //  * Converter a data e horario sem fuso horário para o horario local. (npm install moment)
  //  */
  // var moment = require('moment');
  // var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  // var stillUtc = moment.utc(date).toDate();
  // var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  // if (req.length == 1) {
  //   instance.tipo = "Individual";
  //   instance.funcionario = req[0].funcionario.name;
  //   instance.pis = req[0].funcionario.pis;
  //   instance.requisicao = req[0];
  //   instance.data = local;
  //   instance.save(function (error) {
  //     if (error) {
  //       callback(error);
  //     } else {
  //       callback(null, instance);
  //     }
  //   });
  // } else {
  //   var listanomes = new Array();
  //   var listaNaoGravados = new Array();
  //   for (i = 0; i < req.length; i++) {
  //     var name = req[i].funcionario.name;
  //     if (req[i].funcionario.erro) {
  //       var erro = req[i].funcionario.erro;
  //       listaNaoGravados.push(name + erro);
  //     } else {
  //       listanomes.push(name);
  //     }
  //   }
  //   instance.tipo = "Geral";
  //   instance.funcionario = listanomes;
  //   instance.erro = listaNaoGravados;
  //   instance.requisicao = req;
  //   instance.data = local;
  //   instance.save(function (error) {
  //     if (error) {
  //       callback(error);
  //     } else {
  //       callback(null, instance);
  //     }
  //   });
  // }

}