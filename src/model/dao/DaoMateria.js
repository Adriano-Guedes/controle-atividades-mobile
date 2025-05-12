import { ref, get, push, set, remove } from 'firebase/database';
import MateriaDTO from '../MateriaDTO.js';

export default class DaoMateria {
  async obterMateriaPorId(db, uid, mid) {
    const snap = await get(ref(db, `usuarios/${uid}/materias/${mid}`));
    if (!snap.exists()) throw new Error('Matéria não encontrada');
    const val = snap.val();
    return new MateriaDTO(mid, val.nome, val.descricao, val.criadoEm);
  }


  async obterMateriasPorUsuario(db, uid) {
    const snap = await get(ref(db, `usuarios/${uid}/materias`));
    if (!snap.exists()) return [];
    const obj = snap.val();
    return Object.entries(obj).map(
        ([key, val]) => new MateriaDTO(key, val.nome, val.descricao, val.criadoEm)
    );
  }

  async criarMateria(db, uid, materiaDTO) {
    const res = await push(ref(db, `usuarios/${uid}/materias`), {
      nome: materiaDTO.nome,
      descricao: materiaDTO.descricao,
      criadoEm: materiaDTO.criadoEm
    });
    return res.key;
  }

  async atualizarMateria(db, uid, materiaDTO) {
    await set(ref(db, `usuarios/${uid}/materias/${materiaDTO.id}`), {
      nome: materiaDTO.nome,
      descricao: materiaDTO.descricao,
      criadoEm: materiaDTO.criadoEm
    });
  }

  async excluirMateria(db, uid, mid) {
    await remove(ref(db, `usuarios/${uid}/materias/${mid}`));
  }
}
