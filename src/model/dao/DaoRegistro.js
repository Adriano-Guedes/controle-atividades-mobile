import { ref, get, push } from 'firebase/database';
import RegistroDTO from '../RegistroDTO.js';

export default class DaoRegistro {
  async listarPorAssunto(db, uid, mid, aid) {
    const snap = await get(ref(db, `usuarios/${uid}/materias/${mid}/assuntos/${aid}/registros`));
    if (!snap.exists()) return [];
    const obj = snap.val();
    return Object.entries(obj)
        .map(([key, val]) => new RegistroDTO(key, val.horas, val.data));
  }

  async criar(db, uid, mid, aid, horas) {
    const res = await push(ref(db, `usuarios/${uid}/materias/${mid}/assuntos/${aid}/registros`), {
      horas,
      data: Date.now()
    });
    return res.key;
  }
}