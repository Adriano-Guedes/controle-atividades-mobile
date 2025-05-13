import { getDatabase, ref, get, push, set, remove } from 'firebase/database';
import Assunto from '../Assunto.js';
import ModelError from "../ModelError.js";


export default class DaoAssunto {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoAssunto.promessaConexao == null) {
      DaoAssunto.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoAssunto.promessaConexao;
  }

  async listarPorMateria(userID, materiaId) {
    let connectionDB = await this.obterConexao();
    const snap = await get(ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/assuntos`));
    if (!snap.exists()) return [];
    const obj = snap.val();
    return Object.entries(obj)
        .map(([key, val]) => new Assunto(key, val.nome, val.criadoEm));
  }

  async criar(userID, materiaId, assunto) {
    let connectionDB = await this.obterConexao();
    const res = await push(ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/assuntos`), {
      nome: assunto.nome,
      criadoEm: assunto.criadoEm
    });
    return res.key;
  }

  async excluir(userID, materiaId, assuntoId) {
    let connectionDB = await this.obterConexao();
    await remove(ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/assuntos/${assuntoId}`));
  }
}