import { getDatabase, ref, get, push } from 'firebase/database';
import Registro from '../Registro.js';
import ModelError from "../ModelError.js";


export default class DaoRegistro {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoRegistro.promessaConexao == null) {
      DaoRegistro.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoRegistro.promessaConexao;
  }

  async listarPorAssunto(userId, materiaId, assuntoId) {
    let connectionDB = await this.obterConexao();
    const snap = await get(ref(connectionDB, `usuarios/${userId}/materias/${materiaId}/assuntos/${assuntoId}/registros`));
    if (!snap.exists()) return [];
    const obj = snap.val();
    return Object.entries(obj)
        .map(([key, val]) => new Registro(key, val.horas, val.data));
  }

  async criar(userId, materiaId, assuntoId, registro) {
    let connectionDB = await this.obterConexao();
    const res = await push(ref(connectionDB, `usuarios/${userId}/materias/${materiaId}/assuntos/${assuntoId}/registros`), {
      horas: registro.horas,
      data: registro.data
    });
    return res.key;
  }
}