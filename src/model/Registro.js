export default class Registro {
    constructor(data, hora, atividade) {
        this.data = data;
        this.hora = hora;
        this.atividade = atividade;
    }

    getData() {
        return this.data;
    }

    setData() {
        //Registro.validarData(data);
        this.data = data; 
    }

    getHora() {
        return this.hora;
    }

    setHora() {
        //Registro.validarHora(hora);
        this.hora = hora; 
    }

    getAtividade() {
        return this.atividade;
    }

    setAtividade() {
        //Registro.validarAtividade(atividade);
        this.atividade = atividade; 
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
}