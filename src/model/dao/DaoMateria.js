import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, child, get, set, remove, runTransaction }
  from 'firebase/database';

import Materia from "../Materia.js";
import ModelError from "../ModelError.js";

export default class DaoMateria {

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if(DaoMateria.promessaConexao == null) {
      DaoMateria.promessaConexao = new Promise((resolve, reject) => {
        const db = getDatabase();
        if (db)
          resolve(db);
        else
          reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoMateria.promessaConexao;
  }

  async incluir(materia) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefMaterias = ref(connectionDB, 'materias');
      runTransaction(dbRefMaterias, () => {
        let dbRefNovaMateria = child(dbRefMaterias, materia.getId());
        return set(dbRefNovaMateria, materia)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async alterar(materia) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefMaterias = ref(connectionDB, 'materias');
      runTransaction(dbRefMaterias, () => {
        let dbRefAlterar = child(dbRefMaterias, materia.getId());
        return set(dbRefAlterar, materia)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async excluir(materia) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve, reject) => {
      let dbRefMaterias = ref(connectionDB, 'materias');
      runTransaction(dbRefMaterias, () => {
        let dbRefExcluir = child(dbRefMaterias, materia.getId());
        return remove(dbRefExcluir)
          .then(() => resolve(true))
          .catch(erro => reject(erro));
      });
    });
  }

  async obterMateriaPeloId(id) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let dbRef = ref(connectionDB, 'materias/' + id);
      get(dbRef).then(snapshot => {
        let obj = snapshot.val();
        if (obj != null) {
          resolve(new Materia(obj.id, obj.nome, obj.professor, obj.siglaCurso));
        } else {
          resolve(null);
        }
      });
    });
  }

  async obterTodasMaterias() {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let conjMaterias = [];
      let dbRef = ref(connectionDB, 'materias');
      get(query(dbRef)).then(snapshot => {
        snapshot.forEach(childSnapshot => {
          let obj = childSnapshot.val();
          conjMaterias.push(new Materia(obj.id, obj.nome, obj.professor, obj.siglaCurso));
        });
        resolve(conjMaterias);
      });
    });
  }
}
