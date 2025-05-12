export default class MateriaDTO {
    #nome;
    #descricao;
    #usuario;
  
    constructor(materia) {
      this.#nome = materia.getNome();
      this.#descricao = materia.getDescricao();
      this.#usuario = materia.getUsuario();
    }
  
    getNome() {
      return this.#nome;
    }
  
    getDescricao() {
      return this.#descricao;
    }
  
    getUsuario() {
      return this.#usuario;
    }
  
    toJSON() {
      return '{ ' +
        '"nome" : "' + this.#nome + '",' +
        '"descricao" : "' + this.#descricao + '",' +
        '"usuario" : "' + this.#usuario + '"' +
        ' }';
    }
  }