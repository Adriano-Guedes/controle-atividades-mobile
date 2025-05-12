export default class AtividadeDTO {
    #nome;
    #descricao;
    #materia;
  
    constructor(atividade) {
      this.#nome = atividade.getNome();
      this.#descricao = atividade.getDescricao();
      this.#materia = atividade.getMateria();
    }
  
    getNome() {
      return this.#nome;
    }
  
    getDescricao() {
      return this.#descricao;
    }
  
    getMateria() {
      return this.#materia;
    }
  
    toJSON() {
      return '{ ' +
        '"nome" : "' + this.#nome + '",' +
        '"descricao" : "' + this.#descricao + '",' +
        '"materia" : "' + this.#materia + '"' +
        ' }';
    }
  }