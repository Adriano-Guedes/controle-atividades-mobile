export default class AssuntoDTO {
    constructor(id, nome, criadoEm = Date.now()) {
        this.id = id;
        this.nome = nome;
        this.criadoEm = criadoEm;
    }
}