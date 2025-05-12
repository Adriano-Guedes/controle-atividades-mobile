export default class MateriaDTO {
    constructor(id, nome, descricao, criadoEm = Date.now()) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
    }
}