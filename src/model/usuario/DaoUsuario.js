import { getDatabase, ref, get, update, remove } from "firebase/database";
import Usuario from "./Usuario.js";
import UsuarioId from "./UsuarioId.js";
import ModelError from "../ModelError.js";

export default class DaoUsuario {
  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoUsuario.promessaConexao;
  }

  async editar(userId, usuario) {
    try {
      let connectionDB = await this.obterConexao();
      const updateUsuario = new Usuario(
        usuario.nome,
        usuario.dataNasc,
        usuario.email
      );
  
      await update(ref(connectionDB, `usuarios/${userId}`), {
        nome: updateUsuario.nome,
        dataNasc: updateUsuario.dataNasc,
        email: updateUsuario.email,
      });
  
      return await this.consultarPorId(userId);
    } catch (error) {
      throw new Error("Não foi possível editar dados. Tente novamente.");
    }
  }

  async excluir(userId) {
    try {
      let connectionDB = await this.obterConexao();
      await remove(ref(connectionDB, `usuarios/${userId}`));
    } catch (error) {
      console.errorr("Erro ao excluir usuário:", error);
      throw new Error("Não foi possível excluir usuário. Tente novamente.");
    }
  }

  async consultarPorId(id) {
    try {
      const connectionDB = await this.obterConexao();
      const dbRef = ref(connectionDB, "usuarios/" + id);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const obj = snapshot.val();
        const user = new UsuarioId(snapshot.key, obj.nome, obj.dataNasc, obj.email);
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao consultar dados do usuário:", error);
      throw new Error("Erro ao consultar dados do usuário. Tente novamente.");
    }
  }

  async consultarTodosUsuarios() {
    try {
      let connectionDB = await this.obterConexao();
      const snap = await get(ref(connectionDB, `usuarios`));
      if (!snap.exists()) return [];
      const obj = snap.val();
      return Object.entries(obj).map(([key, val]) => {
        const usuario = new Usuario(val.nome, val.dataNasc, val.email);
        return new UsuarioId(key, usuario.nome, usuario.dataNasc, usuario.email);
      });
    } catch (error) {
      console.error("Erro ao consultar lista de usuários:", error);
      throw new Error("Erro ao consultar lista de usuários. Tente novamente.");
    }
  }
}
