import { getDatabase, ref, get, push, update, remove } from 'firebase/database';
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

  async consultarPorId(userId, materiaId, atividadeId) {
    try {
      const connectionDB = await this.obterConexao();
      const snap = await get(
        ref(connectionDB, `usuarios/${userId}/materias/${materiaId}/atividades/${atividadeId}`)
      );
  
      if (!snap.exists()) throw new Error("Atividade não encontrada");
  
      const val = snap.val();
  
      if (!val.nome || !val.descricao) {
        throw new Error("Dados da atividade incompletos.");
      }
  
      const atividade = new Atividade(val.nome, val.descricao);
      return new AtividadeId(atividadeId, atividade);
  
    } catch (error) {
      console.error("Erro ao consultar atividade:", error);
      throw new Error("Não foi possível consultar a atividade. Tente novamente.");
    }
  }
  

  async criar(userId, materiaId, atividade) {
    try {
      const connectionDB = await this.obterConexao();
  
      const newAtividade = new Atividade(atividade.nome, atividade.descricao);

      const res = await push(
        ref(connectionDB, `usuarios/${userId}/materias/${materiaId}/atividades`),
        {
          nome: newAtividade.nome,
          descricao: newAtividade.descricao
        }
      );
      return new AtividadeId(res.key, newAtividade);
    } catch (error) {
      console.errorr("Erro ao criar atividade:", error);
      throw new Error("Não foi possível salvar a atividade. Tente novamente.");
    }
  }

  async editar(userId, materiaId, atividadeId, atividade) {
    try {
      const connectionDB = await this.obterConexao();
      const updateAtividade = new Atividade(
        atividade.nome,
        atividade.descricao
      );
      await update(
        ref(
          connectionDB,
          `usuarios/${userId}/materias/${materiaId}/atividades/${atividadeId}`
        ),
        {
          nome: updateAtividade.nome,
          descricao: updateAtividade.descricao,
        }
      );
      return new AtividadeId(atividadeId, updateAtividade);
    } catch (error) {
      console.error("Erro ao editar atividade:", error);
      throw new Error("Não foi possível editar a atividade. Tente novamente.");
    }
  }

  async excluir(userId, materiaId, atividadeId) {
    try {
      const connectionDB = await this.obterConexao();
      await remove(
        ref(connectionDB, `usuarios/${userId}/materias/${materiaId}/atividades/${atividadeId}`)
      );
    } catch (error) {
      console.errorr("Erro ao excluir atividade:", error);
      throw new Error("Não foi possível excluir a atividade. Tente novamente.");
    }
  }
  
}