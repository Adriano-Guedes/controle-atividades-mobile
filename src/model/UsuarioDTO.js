export default class UsuarioDTO {
    #nome;
    #data_nasc;
    #email;
  
    constructor(usuario) {
      this.#nome = usuario.getNome();
      this.#data_nasc = usuario.getData_nasc();
      this.#email = usuario.getEmail();
    }
  
    getNome() {
      return this.#nome;
    }
  
    getData_nasc() {
      return this.#data_nasc;
    }
  
    getEmail() {
      return this.#email;
    }
  
    toJSON() {
      return '{ ' +
        '"nome" : "' + this.#nome + '",' +
        '"data_nasc" : "' + this.#data_nasc + '",' +
        '"email" : "' + this.#email + '"' +
        ' }';
    }
  }