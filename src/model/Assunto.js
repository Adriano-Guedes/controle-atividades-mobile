import ModelError from "./ModelError.js";

export default class Assunto{
    constructor(nome, data){
        this.nome = nome;
        this.data = data;
    }

    getNome() {
        return this.nome;
    }

    setNome(nome) {
        Assunto.validarNome(nome)
        this.nome = nome; 
    }

    getData() {
        return this.data;
    }

    setData(data) {
        Assunto.validarData(data);
        this.data = data; 
    }

    static validarData(data) {
        const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = data.match(regexData);

        if (!match) return false;

        let dia = parseInt(match[1], 10);
        let mes = parseInt(match[2], 10) - 1;
        let ano = parseInt(match[3], 10);
        let dataObj = new Date(ano, mes, dia);
        let hoje = new Date();
        let idade = hoje.getFullYear() - ano;

        return (
            dataObj.getDate() === dia &&
            dataObj.getMonth() === mes &&
            dataObj.getFullYear() === ano &&
            idade >= 0 && idade <= 130
        );
    }

    static validarNome(nome) {
        if (!nome || typeof nome !== "string")
          throw new ModelError("Nome inválido ou não é uma string!");
        if (nome.length < 1 || nome.length > 50)
          throw new ModelError("Nome deve possuir entre 1 e 50 caracteres!");
      }
}