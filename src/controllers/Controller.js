/**
 * @author <marcus@publitechsistemas.com.br>
 */
exports.get = (req, res, next) => {

    //serve static files from template    
    //     res.send(req.query.cpf);

    //     var request = require('request');
    //     // var parametros = req.params.parametros;
    //     // var jsonparametros = JSON.parse(parametros);
    //     var url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
    //     var headers = { 'X-Auth-Token': 'iswHJ9ZkhNc6Qctjokkq', 'Content-type': 'application/json', 'Accept': 'application/json' };
    //     request({ url: url, headers: headers }, function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             res.sendStatus(response.statusCode);
    //         } else if (response.statusCode == 401) {
    //             res.status(401).send('Acesso não autorizado, verifique o token!');
    //         }
    //    })
};

exports.post = (function (req, callback) {
    global.method = 'POST';
    /**
     * Variaveis para informar as configuraçoes locais obtidas da api web e mongolab.
     */
    var config_aise = global.aise;
    var config_mongo = global.mongo_local;
    var config_api = global.url_api;
    var config_token = global.token;
    var config_gestor = global.url_gestor;

    if (req == 1) {
        /**
         * Replicação dos funcionários do ponto gestor para mongodb em nuvem
         */
        var request = require('request'), default_headers, url = config_gestor + '/v1/funcionarios/';
        default_headers = { 'X-Auth-Token': config_token, 'Content-type': 'application/json', 'Accept': 'application/json' };
        request({
            url: url,
            headers: default_headers,
            method: 'GET',
        }, function (error, res, body) {
            if (error) {
                console.log("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error);
                callback("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error, null);
            }
            if (!error && res.statusCode == 401) {
                console.log("Erro ao conectar-se ao Ponto Gestor:" + res.statusMessage);
                callback("Erro ao conectar-se ao Ponto Gestor:" + res.statusMessage, null, null);
            } else if (!error && res.statusCode == 200) {
                PontoModel = require('../model/pontoModel.js');
                PontoModel.replicacao_mongo(body, function (error, result) {
                    if (error) {
                        callback(error, null);
                    };
                });
            } else {
                console.log("Algo deu errado. Contate o suporte" + res.statusMessage);
                callback("Algo deu errado. Contate o suporte" + res.statusMessage, null, null);
            }
        });
        /**
         * inserção de Justificativas. Conecta com a apiaise local da entidade, faz os scripts e retorna
         * com os dados (erro, status de inserção)
         */
        var paramentros_locais = { config_aise, config_mongo, config_token, config_gestor };

        var request = require('request');
        var url = config_api + '/justificativas';
        var request = require('request');
        var headers = { 'Content-type': 'application/json', 'Accept': 'application/json' };
        request({ url: url, headers: headers, method: 'GET', body: JSON.stringify(paramentros_locais) }, function (error, response, body) {
            if (error) {
                callback(error, null);
                return;
            };
            if (response.statusCode == 400) {
                callback(body, null);
            }
            if (response.statusCode == 200) {
                callback(null, body);
            }
        });
    } else {
        /**
         * Cria a variável sql para a consulta no banco postgres local.
         */
        PontoModel = require('../model/pontoModel.js');
        //console.log(req.body);
        if (req) {
            var cpf = req.body.cpf.replace(/\D+/g, '');
        } else {
            var cpf = '';
        }
        PontoModel.consultaAise(cpf, function (error, result) {
            if (error) {
                callback(error, null);
                return;
            } else {
                global.sql = result;
            }
        });
        var sql = global.sql;
        var config_local = { config_aise, config_mongo, sql };
        /**
         * passando valor para variavel req para testes. Será repassado pelo usuario.
         */
        // var cpf = req.body.cpf;
        // req = cpf;
        /**
         * caminho para o banco de dados aise e mongo local do servidor
         * parametros utilizados do usuario de cada entidade no mLab;
         */
        //cpf: 562.107.289-87
        var request = require('request');
        var url = global.url_api + '/funcionarios';
        var headers = { 'Content-type': 'application/json', 'Accept': 'application/json' };
        request({ url: url, headers: headers, method: 'GET', body: JSON.stringify(config_local) }, function (error, response, body) {
            if (error) {
                callback(500, "Erro ao conectar na aplicação local");
                console.log(error);
                return;
            } else if (!error && response.statusCode >=400 ) {//conectou ao postgres pela api do servidor, mas retornou consulta em branco
                callback(response.statusCode, response.body);
                return;
            } else if (!error && response.statusCode == 200) {//conectou ao postgres pela api do servidor com OK na consulta
                req = JSON.parse(response.body);
                PontoModel.criaRequisicao(req, function (error, result) {
                    if (error) {
                        callback(error, null);
                    } else {
                        req = result;
                        RequisicaoPontoGestor = require('../model/requisicao.pontogestorModel.js');
                        RequisicaoPontoGestor.requisicao_pontogestor(req, function (problem, error, result) {
                            /** 
                             * retorna=>
                             * error: lista com nomes dos nao gravados que apresentaram erros no ponto gestor
                             * result: lista com nomes dos gravados no ponto gestor
                             */
                            if (problem) {

                                var erroconexao = problem;

                            } else {
                                if (error.length != 0) {
                                    var errosTela = new Array();
                                    var listaerros = error;
                                    errosTela.push("Erros foram encontrados. Funcionários não gravados: <br> <br>");
                                    //var listaerros = ("Erros foram encontrados. Os dados abaixo não foram gravados no Ponto Gestor:<br><br>" + error.funcionario);        
                                    //Teste para gravação de erros, enviando lista de erros
                                    // PontoModel.gravaPontodb(listaerros, function (error, result) {
                                    //     if (error) {
                                    //         console.log('Problema ao gravar no Mongodb. Verifique!', error);
                                    //         return
                                    //         //callback(error, null);
                                    //     } else {
                                    //         console.log("Gravado com Sucesso no MongoDB ");
                                    //         return
                                    //         //res.send("Gravado com Sucesso");
                                    //     }
                                    // })
                                    for (let i = 0; i < error.length; i++) {
                                        errosTela.push(listaerros[i].funcionario.name, JSON.stringify(listaerros[i].funcionario.erro), "<br><br>");
                                    }
                                }
                                if (result.length != 0) {
                                    var listagravados = result;
                                    //console.log(listagravados);
                                    PontoModel.gravaPontodb(listagravados, function (error, result) {
                                        if (error) {
                                            console.log('Problema ao gravar no Mongodb. Verifique!', error);
                                            //callback(error, null);
                                            return
                                        } else {
                                            console.log("Gravado com Sucesso no MongoDB");
                                            return
                                            //res.send("Gravado com Sucesso");
                                        }
                                    })
                                }
                            }
                            if (erroconexao) {
                                //res.send(erroconexao);
                                callback(400, erroconexao);
                                return;
                            } else {
                                if (listaerros) {

                                    //console.log(teste.replace(',',' '));
                                    callback(500, errosTela.join(' '));
                                    //callback(listaerros, null);
                                    return;
                                }
                                else {
                                    callback(200, "Todos os funcionários foram gravados com sucessso!");
                                    return;
                                }
                            }
                        });
                    }
                });
                //callback(response.statusCode, response.body);
                //return;

            }

        });

    };

    return;

    //     var request = require('request'), default_headers, url = 'http://localhost:3100/';
    //     default_headers = {'Content-type': 'application/json', 'Accept': 'application/json' };
    //     request({
    //     url: url,
    //     headers: default_headers,
    //     method: 'GET',
    //     body: JSON.parse('teste')
    //   }, function (error, res, body) {
    //     /**
    //      * Obs. Tratar erros de acesso negado. StatusCode
    //      */
    //     console.log(res);
    //     //console.log(error);

    //     return;
    //     if (!error && res.statusCode == 401) {
    //       console.log(res.statusMessage);
    //       callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
    //     } else if (!error && res.statusCode == 201) {
    //       console.log("Gravado com Sucesso no Ponto Gestor");
    //       callback(null, null, res.statusMessage);
    //     } else {
    //       console.log("Houve erros na gravaçao no Ponto Gestor");
    //       callback(null, res.body, null);
    //     }
    //   });
    // PontoModel = require('../model/pontoModel.js');

    // PontoModel.consultaAise(req, function (error, result) {
    //     if (error) {
    //         callback(error, null);

    //     } else {
    //         /**
    //          * somente para testar gravacao no mongo. O correto esta abaixo.
    //          */
    //         req = result;
    //         PontoModel.criaRequisicao(req, function (error, result) {
    //             if (error) {
    //                 callback(error, null);
    //             } else {
    //                 req = result;
    //                 RequisicaoPontoGestor = require('../model/requisicao.pontogestorModel.js');
    //                 RequisicaoPontoGestor.requisicao_pontogestor(req, function (problem, error, result) {
    //                     /** 
    //                      * retorna=>
    //                      * error: lista com nomes dos nao gravados que apresentaram erros no ponto gestor
    //                      * result: lista com nomes dos gravados no ponto gestor
    //                      */
    //                     if (problem) {

    //                         var erroconexao = problem;

    //                     } else {
    //                         if (error.length != 0) {
    //                             var listaerros = ("Erros foram encontrados. Dados não gravados no Ponto Gestor:<br><br>" + error);
    //                         }
    //                         //console.log(result.length);
    //                         if (result.length != 0) {
    //                             var listagravados = result;
    //                             //console.log(listagravados);
    //                             PontoModel.gravaPontodb(listagravados, function (error, result) {
    //                                 if (error) {
    //                                     console.log('Problema ao gravar no Mongodb. Verifique!', error);
    //                                     //callback(error, null);
    //                                 } else {
    //                                     console.log("Gravado com Sucesso");
    //                                     //res.send("Gravado com Sucesso");
    //                                 }
    //                             })
    //                         }
    //                     }
    //                     if (erroconexao) {
    //                         //res.send(erroconexao);
    //                         callback(erroconexao, null);
    //                     } else {
    //                         if (listaerros) {

    //                             callback(listaerros, null);
    //                         }
    //                         else {
    //                             callback(null, "Todos os funcionários foram gravados com sucessso!");
    //                         }
    //                     }
    //                 });
    //             }
    //         });
    // PontoModel.gravaPontodb(listagravados, function (error, result) {
    //     if (error) {
    //         console.log('Problema ao gravar no Mongodb. Verifique!', error);
    //         callback(error, null);
    //     } else {
    //         console.log("Gravado com Sucesso");
    //         res.send("Gravado com Sucesso");
    //     }
    // })
    //}

    //});
});
//PontoModel.gravaFuncionario(req, function (error, result) {

//res.send(result);
/**
  * Esta no lugar errado somente para teste. Remover após testar
  * A chamada dessa funçao deve ser dentro do else da funcao gravaFuncionario
  */
// if (error) {
//     res.send(error);
// } else {
//     req = JSON.parse(result);
//     PontoModel.gravaPontodb(req, function (error, result) {
//         if (error) {
//             console.log('Problema ao gravar no Mongodb. Verifique!', error);
//             callback(error, null);
//         } else {
//             console.log(result);
//             res.send("Gravado com Sucesso");
//         }
//     })

// }
// })

// var request = require('request');
// //var jsonparametros = JSON.parse(parametros);
// var url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
//  var headers = {'X-Auth-Token' : 'iswHJ9ZkhNc6Qctjokkq', 'Content-type': 'application/json', 'Accept': 'application/json'};
//  request({url:url,headers:headers}, function (error, response, body){
//    if (!error && response.statusCode == 200) {

//    let teste = req;
//     console.log(teste);
//     res.status(200).send();
//     //res.status(200).send(parametros, parametros2, response.statusCode);    
//   }else if (response.statusCode == 401){
//     res.status(401).send('Acesso não autorizado, verifique o token!' ); 
//   }   
//})
//};
//     res.status(201).send(`Requisição recebida com sucesso!` );
// };

exports.patch = (function (req, callback) {
    global.method = 'PATCH';
    PontoModel = require('../model/pontoModel.js');
    PontoModel.consultaAise(req, function (error, result) {
        if (error) {
            callback(error, null);
        } else {
            req = result;
            PontoModel.consultaFuncionario(req, function (problem, error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    if (result == 200) {
                        PontoModel.criaRequisicao(req, function (error, result) {

                            if (error) {
                                callback(error, null);
                            } else {
                                req = result;
                                RequisicaoPontoGestor = require('../model/requisicao.pontogestorModel.js');
                                RequisicaoPontoGestor.requisicao_pontogestor(req, function (problem, error, result) {
                                    /** 
                                     * retorna=>
                                     * error: lista com nomes dos nao gravados que apresentaram erros no ponto gestor
                                     * result: lista com nomes dos gravados no ponto gestor
                                     */
                                    if (problem) {
                                        var erroconexao = problem;
                                    } else {
                                        if (error.length != 0) {
                                            var listaerros = ("Funcionário com erros e não alterado no Ponto:<br><br>" + error);
                                        }
                                        if (result.length != 0) {
                                            var listagravados = result;
                                            PontoModel.gravaPontodb(listagravados, function (error, result) {
                                                if (error) {
                                                    console.log('Problema ao gravar no Mongodb. Verifique!', error);
                                                } else {
                                                    console.log("Gravado com Sucesso");
                                                }
                                            })
                                        }
                                    }
                                    if (erroconexao) {
                                        callback(erroconexao, null);
                                    } else {
                                        if (listaerros) {
                                            callback(listaerros, null);
                                        }
                                        else {
                                            callback(null, "Funcionário alterado com sucessso!");
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});
exports.delete = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida com sucesso!`);
};