import ModelError from "./ModelError.js";

export default class Usuario {
  constructor(nome, data_nasc, email) {
    this.setNome(nome);
    this.setDataNasc(data_nasc);
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
    return this.data_nasc;
  }

  setDataNasc(data_nasc) {
    Usuario.validarDataNasc(data_nasc);
    this.data_nasc = data_nasc;
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
    const padraoNome = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']+$/;
    if (!padraoNome.test(nome))
      throw new ModelError("O nome do usuário só pode conter letras!");
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
