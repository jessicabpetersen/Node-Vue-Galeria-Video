const express = require("express");
const router = express.Router();

const GaleriaModel = require("../model/GaleriaModel");
const RespostaClass = require("../model/RespostaClass");

let pastaPublica = './public/arquivos/';
let multer = require('multer');
let path = require('path');
let fs = require('fs');

var storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, pastaPublica)
    },
    filename : function(req, file, cb){
        //cb(null, file.fieldname + "-" + Date.now())
        let nomeArquivo = `${file.fieldname.replace(/\//g, '')}-${Date.now()}${path.extname(file.originalname)}`;
        req.body.caminho = pastaPublica+nomeArquivo;
        cb(null, nomeArquivo)
    }
});
 
var upload = multer({storage: storage});

function deletarArquivo(caminho){
    if(caminho!= null){
        fs.unlinkSync(caminho);
        console.log('arquivo deletado');
    }
}

router.post("/", upload.single('arquivo'), function(req, resp, next){
    let resposta = new RespostaClass();

    if(req.file != null){
        GaleriaModel.adicionar(req.body, function(erro, retorno){
            if(erro){
               resposta.erro = true;
               resposta.msg = "Ocorreu um erro.";
               console.log("erro: ", erro);
               deletarArquivo(req.body.caminho);
            }else{
                if(retorno.affectedRows > 0){
                    resposta.msg = "cadastro realizado com sucesso";
                }else{
                    resposta.erro = true;
                    resposta.msg = "Não foi possivel realizar a operação.";
                    console.log("erro: ", erro);
                    deletarArquivo(req.body.caminho);
                }
                
            }
            console.log('resp: ', resposta);
            resp.json(resposta);
       });
    }else{
        resposta.erro = true;
        resposta.msg = "Não foi enviado um video.";
        console.log("erro: ", erro);
        req.json(resposta);
    }
});

router.get("/", function(req, resp, next){
    GaleriaModel.getTodos(function(erro, retorno){
         let resposta = new RespostaClass();

         if(erro){
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro.";
            console.log("erro: ", erro);
         }else{
             resposta.dados = retorno;
         }

         resp.json(resposta);
    });
});

router.get("/:id?", function(req, resp, next){
    GaleriaModel.getId(req.params.id, function(erro, retorno){
         let resposta = new RespostaClass();

         if(erro){
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro.";
            console.log("erro: ", erro);
         }else{
             resposta.dados = retorno;
         }

         resp.json(resposta);
    });
});


router.put("/", upload.single('arquivo'), function(req, resp, next){
    let resposta = new RespostaClass();

        GaleriaModel.editar(req.body, function(erro, retorno){
            if(erro){
               resposta.erro = true;
               resposta.msg = "Ocorreu um erro.";
               console.log("erro: ", erro);
               deletarArquivo(req.body.caminho);
            }else{
                if(retorno.affectedRows > 0){
                    resposta.msg = "cadastro alterado com sucesso";
                }else{
                    resposta.erro = true;
                    resposta.msg = "Não foi possivel realizar a operação.";
                    console.log("erro: ", erro);
                    deletarArquivo(req.body.caminho);
                }
            }
            console.log('resp: ', resposta);
            resp.json(resposta);
       });
});

router.delete("/:id?", function(req, resp, next){
    GaleriaModel.deletar(req.params.id, function(erro, retorno){
         let resposta = new RespostaClass();

         if(erro){
            resposta.erro = true;
            resposta.msg = "Ocorreu um erro.";
            console.log("erro: ", erro);
         }else{
            if(retorno.affectedRows > 0){
                resposta.msg = "Arquivo deletado com sucesso";
            }else{
                resposta.erro = true;
                resposta.msg = "Não foi possivel realizar a operação.";
                console.log("erro: ", erro);
                deletarArquivo(req.body.caminho);
            }
         }

         resp.json(resposta);
    });
});

module.exports = router;




