import { getDatabase, ref, get, push, set, remove } from "firebase/database";
import Materia from "../Materia.js";
import ModelError from "../ModelError.js";


export default class DaoMateria {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoMateria.promessaConexao == null) {
      DaoMateria.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoMateria.promessaConexao;
  }

  async obterMateriaPorId(userId, materiaId) {
    let connectionDB = await this.obterConexao();
    const snap = await get(
      ref(connectionDB, `usuarios/${userId}/materias/${materiaId}`)
    );
    if (!snap.exists()) throw new Error("Matéria não encontrada");
    const val = snap.val();
    return new Materia(materiaId, val.nome, val.descricao, val.criadoEm);
  }

  async obterMateriasPorUsuario(userId) {
    let connectionDB = await this.obterConexao();
    const snap = await get(ref(connectionDB, `usuarios/${userId}/materias`));
    if (!snap.exists()) return [];
    const obj = snap.val();
    return Object.entries(obj).map(
      ([key, val]) => new Materia(key, val.nome, val.descricao, val.criadoEm)
    );
  }

  async criarMateria(userId, materia) {
    let connectionDB = await this.obterConexao();
    const res = await push(ref(connectionDB, `usuarios/${userId}/materias`), {
      nome: materia.nome,
      descricao: materia.descricao,
      criadoEm: materia.criadoEm,
    });
    return res.key;
  }

  async atualizarMateria(userId, materia) {
    let connectionDB = await this.obterConexao();
    await set(ref(connectionDB, `usuarios/${userId}/materias/${materia.id}`), {
      nome: materia.nome,
      descricao: materia.descricao,
      criadoEm: materia.criadoEm,
    });
  }

  async excluirMateria(userId, materiaId) {
    let connectionDB = await this.obterConexao();
    await remove(ref(connectionDB, `usuarios/${userId}/materias/${materiaId}`));
  }
}
