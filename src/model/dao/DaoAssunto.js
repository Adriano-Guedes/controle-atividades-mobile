import { ref, get, push, set, remove } from 'firebase/database';
import AssuntoDTO from '../AssuntoDTO.js';

export default class DaoAssunto {
  async listarPorMateria(db, uid, mid) {
    const snap = await get(ref(db, `usuarios/${uid}/materias/${mid}/assuntos`));
    if (!snap.exists()) return [];
    const obj = snap.val();
    return Object.entries(obj)
        .map(([key, val]) => new AssuntoDTO(key, val.nome, val.criadoEm));
  }

  async criar(db, uid, mid, assuntoDTO) {
    const res = await push(ref(db, `usuarios/${uid}/materias/${mid}/assuntos`), {
      nome: assuntoDTO.nome,
      criadoEm: assuntoDTO.criadoEm
    });
    return res.key;
  }

  async excluir(db, uid, mid, aid) {
    await remove(ref(db, `usuarios/${uid}/materias/${mid}/assuntos/${aid}`));
  }
}