import { getDatabase, ref, get, push, set, remove } from "firebase/database";
import Materia from "./Materia.js";
import MateriaId from "./MateriaId.js";
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

  async consultarPorId(userId, materiaId) {
    try {
      let connectionDB = await this.obterConexao();
      const snap = await get(
        ref(connectionDB, `usuarios/${userId}/materias/${materiaId}`)
      );
      if (!snap.exists()) throw new Error("Matéria não encontrada");
      const val = snap.val();
      const materia = new Materia(val.nome, val.descricao);
      return new MateriaId(materiaId, materia);
    } catch (error) {
      console.error("Erro ao consulta matéria:", error);
      throw new Error("Não foi possível consultar a matéria. Tente novamente.");
    }
  }

  async consultarPorUsuario(userId) {
    try {
      let connectionDB = await this.obterConexao();
      const snap = await get(ref(connectionDB, `usuarios/${userId}/materias`));
      if (!snap.exists()) return [];
      const obj = snap.val();
      return Object.entries(obj).map(([key, val]) => {
        const materia = new Materia(val.nome, val.descricao);
        return new MateriaId(key, materia);
      });
    } catch (error) {
      console.error("Erro ao listar matérias:", error);
      throw new Error("Não foi possível listar as matérias. Tente novamente.");
    }
  }

  async criar(userId, materia) {
    try {
      let connectionDB = await this.obterConexao();
      const newMateria = new Materia(materia.nome, materia.descricao);
      const res = await push(ref(connectionDB, `usuarios/${userId}/materias`), {
        nome: newMateria.nome,
        descricao: newMateria.descricao,
      });
      return res.key;
    } catch (error) {
      console.error("Erro ao criar matéria:", error);
      throw new Error("Não foi possível criar a matéria. Tente novamente.");
    }
  }

  async editar(userId, materia) {
    try {
      let connectionDB = await this.obterConexao();
      const updateMateria = new Materia(materia.nome, materia.descricao);
      await set(ref(connectionDB, `usuarios/${userId}/materias/${materia.id}`), {
        nome: updateMateria.nome,
        descricao: updateMateria.descricao,
      });
    } catch (error) {
      console.error("Erro ao editar matéria:", error);
      throw new Error("Não foi possível editar a matéria. Tente novamente.");
    }
  }

  async excluir(userId, materiaId) {
    try {
      let connectionDB = await this.obterConexao();
      await remove(ref(connectionDB, `usuarios/${userId}/materias/${materiaId}`));
    } catch (error) {
      console.errorr("Erro ao excluir matéria:", error);
      throw new Error("Não foi possível excluir a matéria. Tente novamente.");
    }
  }
}
