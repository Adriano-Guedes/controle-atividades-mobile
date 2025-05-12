export default class RegistroDTO {
    constructor(id, horas, data = Date.now()) {
        this.id = id;
        this.horas = horas;
        this.data = data;
    }
}