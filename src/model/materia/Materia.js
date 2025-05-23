import ModelError from "../ModelError.js";

export default class Materia {
  constructor(nome, descricao) {
    this.setNome(nome);
    this.setDescricao(descricao);
  }

  getNome() {
    return this.nome;
  }

  setNome(nome) {
    Materia.validarNome(nome);
    this.nome = nome;
  }

  getDescricao() {
    return this.descricao;
  }

  setDescricao(descricao) {
    Materia.validarDescricao(descricao);
    this.descricao = descricao;
  }

  // --------------------------------------------------------

  static validarNome(nome) {
    if (typeof nome !== "string" || !nome.trim()) {
      throw new ModelError("Nome inválido: deve ser uma string não vazia!");
    }
  
    const tamanho = nome.trim().length;
  
    if (tamanho < 1 || tamanho > 50) {
      throw new ModelError("Nome deve ter entre 1 e 50 caracteres!");
    }
  }
  

  // --------------------------------------------------------

  static validarDescricao(descricao) {
    if (!descricao || typeof descricao !== "string")
      throw new ModelError("Descrição inválida ou não é uma string!");
    if (descricao.length < 1 || descricao.length > 250)
      throw new ModelError("Descrição deve possuir entre 1 e 250 caracteres!");
  }

  // --------------------------------------------------------

  static validarUsuario(usuario) {
    if (!usuario || typeof usuario !== "string")
      throw new ModelError("Usuário inválido ou não é uma string!");
    if (usuario.length < 1 || usuario.length > 250)
      throw new ModelError("Usuário deve possuir entre 1 e 250 caracteres!");
  }
}
