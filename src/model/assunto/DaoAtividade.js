import { getDatabase, ref, get, push, set, remove } from 'firebase/database';
import Atividade from './Atividade.js';
import AtividadeId from './AtividadeId.js';
import ModelError from "../ModelError.js";

export default class DaoAtividade {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoAtividade.promessaConexao == null) {
      DaoAtividade.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoAtividade.promessaConexao;
  }

  async consultarPorMateria(userID, materiaId) {
    try {
      const connectionDB = await this.obterConexao();
      const snap = await get(
        ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/atividades`)
      );
  
      if (!snap.exists()) return [];
  
      const obj = snap.val();
  
      return Object.entries(obj).map(([key, val]) => {
        const atividade = new Atividade(val.nome, val.descricao);
        return new AtividadeId(key, atividade);
      });
  
    } catch (error) {
      console.errorr("Erro ao listar atividades por matéria:", error);
      throw new Error("Não foi possível listar as atividades. Tente novamente.");
    }
  }

  async criar(userID, materiaId, atividade) {
    try {
      const connectionDB = await this.obterConexao();
  
      const newAtividade = new Atividade(atividade.nome, atividade.descricao);

      const res = await push(
        ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/atividades`),
        {
          nome: newAtividade.nome,
          descricao: newAtividade.descricao
        }
      );
      return res.key;
    } catch (error) {
      console.errorr("Erro ao criar atividade:", error);
      throw new Error("Não foi possível salvar a atividade. Tente novamente.");
    }
  }

  async editar(userID, materiaId, atividadeId, atividade){
    try {
      const connectionDB = await this.obterConexao();

      const updateAtividade = new Atividade(atividade.nome, atividade.descricao);
      await set(ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/atividades/${atividadeId}`), {
        nome: updateAtividade.nome,
        descricao: updateAtividade.descricao
      });
    } catch (error) {
      console.errorr("Erro ao editar atividade:", error);
      throw new Error("Não foi possível editar a atividade. Tente novamente.");
    }
  }

  async excluir(userID, materiaId, atividadeId) {
    try {
      const connectionDB = await this.obterConexao();
      await remove(
        ref(connectionDB, `usuarios/${userID}/materias/${materiaId}/atividades/${atividadeId}`)
      );
    } catch (error) {
      console.errorr("Erro ao excluir atividade:", error);
      throw new Error("Não foi possível excluir a atividade. Tente novamente.");
    }
  }
  
}