/**
 * @author <marcus@publitechsistemas.com.br>
 */
module.exports.gravaPontodb = gravaPontodb;
module.exports.consultaAise = consultaAise;
module.exports.gravaFuncionario = gravaFuncionario;
/**
 * 
 * @param {*} req (requisiçao para consulta)
 * @param {*} callback (retorno:error,result)
 */

function consultaAise(req, callback) {
  /**
   * Obs.: Trocar essa conexao por um arquivo js.
   */
  connect();
  function connect() {
    var pg = require('pg');
    const connectionString = process.env.DATABASE_URL || 'postgres://aise@localhost:32768/cmpg';
    client = new pg.Client(connectionString);
    client.connect(function (error, client) {
      if (error) {
        console.log('Problema ao conectar ao Postgres. Verifique!', error);
        callback('Problema ao conectar ao Postgres. Verifique!' + error,null);
        
      } else {
        console.log('Conectado ao Postgres');
      }
    })
    consulta_sql = require('../model/requisicao_aiseModel.js');
    consulta_sql.requisicao_aise(req, function (error, sql) {
      if (error) {
        console.log(error);
        callback(error, null);
      } else {
        const query = client.query(sql, function (error, result) {
          if (error) {
            console.error('error running query', error);
            callback(error, null);
          } else {
            if (result.rowCount == 0 | result == null) {
              error = "Funcionário não encontrado no Aise."
              callback(error, null);
            } else {
              req = result;
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
          }
        })
      }
    });
  }
}
function gravaFuncionario(req, callback) {
  /**
   * Obs. Trocar essa requisicao feita ao  ponto gestor por um arquivo js.
   */
  var request = require('request'), default_headers, url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
  default_headers = { 'X-Auth-Token': 'iswHJ9ZkhNc6Qctjokkq', 'Content-type': 'application/json', 'Accept': 'application/json' };

  request({
    url: url,
    headers: default_headers,
    method: 'POST',
    body: req
  }, function (error, res, body) {
    /**
     * Obs. Tratar erros de acesso negado. StatusCode
     */
    if (!error && res.statusCode == 401) {
      console.log(res.statusMessage);
      callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
    } else if (!error && res.statusCode == 201) {
      console.log("Gravado com Sucesso no Ponto Gestor");
      callback(null, null, res.statusMessage);
    } else {
      console.log("Houve erros na gravaçao no Ponto Gestor");
      callback(null,res.body, null);
    }
  });
};
//var json2 = JSON.parse(JSON.stringify([req.rows[0].name, req.rows[0].pis, req.rows[0].empresa_id, req.rows[0].data_admissao, req.rows[0].exame_data, req.rows[0].exame_apto]));
//let json = (JSON.stringify(tabela));
//callback(null, json);
//var request = require('request');
//var parametros = req.params.parametros;
//var jsonparametros = JSON.parse(parametros);
//var url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/'+json;
//var headers = {'X-Auth-Token' : 'iswHJ9ZkhNc6Qctjokkq', 'Content-type': 'application/json', 'Accept': 'application/json'};
// request({ url: url, headers: headers }, function (error, response, body) {
//   if (!error) {
//     console.log("Gravado no Ponto");
//     callback(body);

//   } else {
//     console.log("Teste");
//     //res.status(401).send('Acesso não autorizado, verifique o token!' ); 
//   }
function gravaPontodb(req, callback) {
  var db = require('../db');
  var PontoSchema = new db.Schema({
    tipo: String,
    funcionario: String,
    pis: String,
    requisicao: JSON,
    data: String
  })
  /**
   * "teste" deve ser substituído pelo usuário que fez a solicitação
   */
  var Ponto = db.mongoose.models.teste || db.mongoose.model('teste', PontoSchema);
  var instance = new Ponto();
  /**
   * Converter a data e horario sem fuso horário para o horario local. (npm install moment)
   */
  var moment = require('moment');
  var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  var stillUtc = moment.utc(date).toDate();
  var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  if (req.length == 1) {
    instance.tipo = "Individual";
    instance.funcionario = req[0].funcionario.name;
    instance.pis = req[0].funcionario.pis;
    instance.requisicao = req[0];
    instance.data = local;
    instance.save(function (error) {
      if (error) {
        callback(error);
      } else {
        callback(null, instance);
      }
    });
  } else {
    var listanomes = new Array();
    for (i = 0; i < req.length; i++) {
      var name = req[i].funcionario.name;
      listanomes.push(name);
    }
    instance.tipo = "Geral";
    instance.funcionario = listanomes;
    instance.requisicao = req;
    instance.data = local;
    instance.save(function (error) {
      if (error) {
        callback(error);
      } else {
        callback(null, instance);
      }
    });
  }
}