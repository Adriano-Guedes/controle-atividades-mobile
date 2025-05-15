import ModelError from "../ModelError.js";

export default class Usuario {
  constructor(nome, dataNasc, email) {
    this.setNome(nome);
    this.setDataNasc(dataNasc);
    this.setEmail(email);
  }

  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Usuario.validarNome(nome);
    this.nome = nome;
  }

  getDataNasc() {
    return this.dataNasc;
  }

  setDataNasc(dataNasc) {
    var data = formatarData(dataNasc)
    Usuario.validarDataNasc(data);
    this.dataNasc = data;
  }

  getEmail() {
    return this.email;
  }

  setEmail(email) {
    Usuario.validarEmail(email);
    this.email = email;
  }

  // -------------------------------------------------------------------

  static validarNome(nome) {
    if (!nome)
      throw new ModelError("O nome do usuário não pode ser nulo!");
    if (nome.length > 40)
      throw new ModelError("O nome do usuário deve ter até 40 caracteres!");
  }

  // -------------------------------------------------------------------

  static validarEmail(email) {
    if (!email)
      throw new ModelError("O email do usuário não pode ser nulo!");
    const padraoEmail = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!padraoEmail.test(email))
      throw new ModelError("O email do usuário não foi digitado corretamente!");
  }

  // -------------------------------------------------------------------

  static validarDataNasc(dataNascimento) {
    const regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataNascimento.match(regexData);

    if (!match) {
      throw new ModelError("Formato de data inválido! Use DD/MM/AAAA.");
    }

    const dia = parseInt(match[1], 10);
    const mes = parseInt(match[2], 10) - 1;
    const ano = parseInt(match[3], 10);

    const data = new Date(ano, mes, dia);

    if (
      data.getDate() !== dia ||
      data.getMonth() !== mes ||
      data.getFullYear() !== ano
    ) {
      throw new ModelError("Data de nascimento inválida!");
    }

    const hoje = new Date();
    const idade = hoje.getFullYear() - ano;

    if (idade < 0 || idade > 130) {
      throw new ModelError("Idade fora do intervalo permitido!");
    }
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
