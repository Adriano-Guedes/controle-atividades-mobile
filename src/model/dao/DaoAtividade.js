import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, child, get, set, remove, runTransaction }
  from 'firebase/database';

import Atividade from "../Atividade.js";
import ModelError from "../ModelError.js";

export default class DaoAtividade {

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if(DaoAtividade.promessaConexao == null) {
      DaoAtividade.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db)
          resolve(db);
        else
          reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoAtividade.promessaConexao;
  }

  async incluir(atividade) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefAtividades = ref(connectionDB, 'atividades');
      runTransaction(dbRefAtividades, () => {
        let dbRefNovaAtividade = child(dbRefAtividades, atividade.getId());
        return set(dbRefNovaAtividade, atividade)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async alterar(atividade) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefAtividades = ref(connectionDB, 'atividades');
      runTransaction(dbRefAtividades, () => {
        let dbRefAlterar = child(dbRefAtividades, atividade.getId());
        return set(dbRefAlterar, atividade)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async excluir(atividade) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefAtividades = ref(connectionDB, 'atividades');
      runTransaction(dbRefAtividades, () => {
        let dbRefExcluir = child(dbRefAtividades, atividade.getId());
        return remove(dbRefExcluir)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async obterAtividadePeloId(id) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let dbRef = ref(connectionDB, 'atividades/' + id);
      get(dbRef).then(snapshot => {
        let obj = snapshot.val();
        if (obj != null) {
          resolve(new Atividade(obj.id, obj.descricao, obj.dataEntrega, obj.materiaId));
        } else {
          resolve(null);
        }
      });
    });
  }

  async obterTodasAtividades() {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let conjAtividades = [];
      let dbRef = ref(connectionDB, 'atividades');
      get(query(dbRef)).then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let obj = childSnapshot.val();
          conjAtividades.push(new Atividade(obj.id, obj.descricao, obj.dataEntrega, obj.materiaId));
        });
        resolve(conjAtividades);
      });
    });
  }
}
