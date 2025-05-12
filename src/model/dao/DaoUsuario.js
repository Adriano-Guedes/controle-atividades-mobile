import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, child, get, set, remove, runTransaction }
  from 'firebase/database';

import Usuario from "../Usuario.js";
import ModelError from "../ModelError.js";

export default class DaoUsuario {

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if(DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db)
          resolve(db);
        else
          reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoUsuario.promessaConexao;
  }

  async incluir(usuario) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefUsuarios = ref(connectionDB, 'usuarios');
      runTransaction(dbRefUsuarios, () => {
        let dbRefNovoUsuario = child(dbRefUsuarios, usuario.getId());
        return set(dbRefNovoUsuario, usuario)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async alterar(usuario) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefUsuarios = ref(connectionDB, 'usuarios');
      runTransaction(dbRefUsuarios, () => {
        let dbRefAlterar = child(dbRefUsuarios, usuario.getId());
        return set(dbRefAlterar, usuario)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async excluir(usuario) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefUsuarios = ref(connectionDB, 'usuarios');
      runTransaction(dbRefUsuarios, () => {
        let dbRefExcluir = child(dbRefUsuarios, usuario.getId());
        return remove(dbRefExcluir)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async obterUsuarioPeloId(id) {
    try {
      const connectionDB = await this.obterConexao();
      const dbRef = ref(connectionDB, 'usuarios/' + id);
      const snapshot = await get(dbRef);
      const obj = snapshot.val();
  
      console.log("obj:", obj);
  
      if (obj != null) {
        return new Usuario(obj.nome, obj.data_nasc, obj.email);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao recuperar os dados do usuário:", error);
      return null;
    }
  }

  async obterTodosUsuarios() {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let conjUsuarios = [];
      let dbRef = ref(connectionDB, 'usuarios');
      get(query(dbRef)).then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let obj = childSnapshot.val();
          conjUsuarios.push(new Usuario(obj.id, obj.nome, obj.email, obj.tipo));
        });
        resolve(conjUsuarios);
      });
    });
  }
}
