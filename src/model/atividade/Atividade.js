import ModelError from "../ModelError.js";

export default class Atividade{
    constructor(nome, descricao){
        this.nome = nome;
        this.descricao = descricao;
    }

    getNome() {
        return this.nome;
    }

    setNome(nome) {
        Atividade.validarNome(nome)
        this.nome = nome; 
    }

    getDescricao() {
        return this.descricao;
    }

    setDescricao(descricao) {
        Atividade.validarDescricao(descricao);
        this.descricao = descricao; 
    }

    static validarNome(nome) {
        if (!nome || typeof nome !== "string")
          throw new ModelError("Nome inválido ou não é uma string!");
        if (nome.length < 1 || nome.length > 50)
          throw new ModelError("Nome deve possuir entre 1 e 50 caracteres!");
      }

      static validarDescricao(descricao) {
        if (!descricao || typeof descricao !== "string")
          throw new ModelError("Descrição inválido ou não é uma string!");
        if (descricao.length > 255)
          throw new ModelError("Descrição deve possuir até 255 caracteres!");
      }
}