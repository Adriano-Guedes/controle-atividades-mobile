export default class RegistroDTO {
    #data;
    #hora;
    #atividade;
  
    constructor(registro) {
      this.#data = registro.getData();
      this.#hora = registro.getHora();
      this.#atividade = registro.getAtividade();
    }
  
    getData() {
      return this.#data;
    }
  
    getHora() {
      return this.#hora;
    }
  
    getAtividade() {
      return this.#atividade;
    }
  
    toJSON() {
      return '{ ' +
        '"data" : "' + this.#data + '",' +
        '"hora" : "' + this.#hora + '",' +
        '"atividade" : "' + this.#atividade + '"' +
        ' }';
    }
  }