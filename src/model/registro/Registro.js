import ModelError from "../ModelError";

export default class Registro {
    constructor(data, horas) {
        this.data = data;
        this.horas = horas;
    }

    getData() {
        return this.data;
    }

    setData(data) {
        //Registro.validarData(data);
        this.data = formatarData(data);
    }

    getHoras() {
        return this.horas;
    }

    setHoras(horas) {
        Registro.validarHoras(horas);
        this.horas = horas;
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

    static validarHoras(horas) {
        if (horas <= 0) throw new ModelError("Quantidade de horas deve ser maior que 0!");;
    }

}
function formatarData(dataStr) {
    const formatoBanco = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
    const formatoFinal = /^\d{2}\/\d{2}\/\d{4}$/;

    if (formatoFinal.test(dataStr)) {
        return dataStr;
    }

    if (formatoBanco.test(dataStr)) {
        const [ano, mes, dia] = dataStr.split(/[-/]/);
        return `${dia}/${mes}/${ano}`;
    }

    return '';
}