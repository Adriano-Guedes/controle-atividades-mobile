import { getDatabase, ref, get, push, remove } from "firebase/database";
import Registro from "./Registro.js";
import RegistroId from "./RegistroId.js";
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

  async consultarPorAtividade(userId, materiaId, atividadeId) {
    try {
      let connectionDB = await this.obterConexao();
      const snap = await get(
        ref(
          connectionDB,
          `usuarios/${userId}/materias/${materiaId}/atividades/${atividadeId}/registros`
        )
      );
      if (!snap.exists()) return [];
      const obj = snap.val();
      return Object.entries(obj).map(([key, val]) => {
        const registro = new Registro(formatarData(val.data), val.horas);
        return new RegistroId(key, registro);
      });
    } catch (error) {
      console.error("Erro ao listar registros por atividade:", error);
      throw new Error("Não foi possível listar os registros. Tente novamente.");
    }

    function formatarData(dataString) {
      const [ano, mes, dia] = dataString.split("-");
      return `${dia}/${mes}/${ano}`;
    }
  }

  async criar(userId, materiaId, atividadeId, registro) {
    try {
      let connectionDB = await this.obterConexao();
      const newRegistro = new Registro(registro.data, parseInt(registro.horas));
      const res = await push(
        ref(connectionDB, `usuarios/${userId}/materias/${materiaId}/atividades/${atividadeId}/registros`),
        {
          horas: newRegistro.horas,
          data: newRegistro.data
        }
      );
      return new RegistroId(res.key, newRegistro);
    } catch (error) {
      console.error("Erro ao criar registro:", error);
      throw new Error("Não foi possível criar o registro. Tente novamente.");
    }
  }

  async excluir(userId, materiaId, atividadeId, registroId) {
    try {
      const connectionDB = await this.obterConexao();
      await remove(
        ref(connectionDB,`usuarios/${userId}/materias/${materiaId}/atividades/${atividadeId}/registros/${registroId}`)
      );
    } catch (error) {
      console.error("Erro ao excluir registro:", error);
      throw new Error("Não foi possível excluir o registro. Tente novamente.");
    }
  }
}
