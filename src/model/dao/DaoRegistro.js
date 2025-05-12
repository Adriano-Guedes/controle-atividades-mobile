import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, child, get, set, remove, runTransaction }
  from 'firebase/database';

import Registro from "../Registro.js";
import ModelError from "../ModelError.js";

export default class DaoRegistro {

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if(DaoRegistro.promessaConexao == null) {
      DaoRegistro.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db)
          resolve(db);
        else
          reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoRegistro.promessaConexao;
  }

  async incluir(registro) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefRegistros = ref(connectionDB, 'registros');
      runTransaction(dbRefRegistros, () => {
        let dbRefNovoRegistro = child(dbRefRegistros, registro.getId());
        return set(dbRefNovoRegistro, registro)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async alterar(registro) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefRegistros = ref(connectionDB, 'registros');
      runTransaction(dbRefRegistros, () => {
        let dbRefAlterar = child(dbRefRegistros, registro.getId());
        return set(dbRefAlterar, registro)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async excluir(registro) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefRegistros = ref(connectionDB, 'registros');
      runTransaction(dbRefRegistros, () => {
        let dbRefExcluir = child(dbRefRegistros, registro.getId());
        return remove(dbRefExcluir)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async obterRegistroPeloId(id) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let dbRef = ref(connectionDB, 'registros/' + id);
      get(dbRef).then(snapshot => {
        let obj = snapshot.val();
        if (obj != null) {
          resolve(new Registro(obj.id, obj.dataRegistro, obj.status, obj.atividadeId, obj.alunoId));
        } else {
          resolve(null);
        }
      });
    });
  }

  async obterTodosRegistros() {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let conjRegistros = [];
      let dbRef = ref(connectionDB, 'registros');
      get(query(dbRef)).then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let obj = childSnapshot.val();
          conjRegistros.push(new Registro(obj.id, obj.dataRegistro, obj.status, obj.atividadeId, obj.alunoId));
        });
        resolve(conjRegistros);
      });
    });
  }
}
