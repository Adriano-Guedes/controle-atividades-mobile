import Materia from "../materia.js";
import ModelError from "../ModelError.js";

export default class Atividade {
  constructor(nome, descricao, materia) {
    this.setNome(nome);
    this.setDescricao(descricao);
    this.setMateria(materia);
  }

  getNome() {
    return this.nome;
  }

  setNome(nome) {
    //Atividade.validarNome(nome);
    this.nome = nome;
  }

  getDescricao() {
    return this.descricao;
  }

  setDescricao(descricao) {
    //Atividade.validarDescricao(descricao);
    this.descricao = descricao;
  }

  getMateria() {
    return this.materia;
  }

  setMateria(materia) {
    //Atividade.validarMateria(materia);
    this.materia = materia;
  }

  // ---------------------------------------------------------------------

  static validarNome(nome) {
    if (!nome || typeof nome !== "string")
      throw new ModelError("Nome inválido ou não é uma string!");
    if (nome.length < 1 || nome.length > 50)
      throw new ModelError("Nome deve possuir entre 1 e 50 caracteres!");
  }

  // ---------------------------------------------------------------------

  static validarDescricao(descricao) {
    if (!descricao || typeof descricao !== "string")
      throw new ModelError("Descrição inválida ou não é uma string!");
    if (descricao.length < 1 || descricao.length > 250)
      throw new ModelError("Descrição deve possuir entre 1 e 250 caracteres!");
  }

  // ---------------------------------------------------------------------

  static validarMateria(materia) {
    if (!materia)
      throw new ModelError("Matéria não pode ser nula!");
    if (!(materia instanceof Materia))
      throw new ModelError("Matéria deve ser uma instância da classe Materia!");
  }
}
