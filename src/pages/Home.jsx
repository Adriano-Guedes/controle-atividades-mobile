import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import DaoUsuario from '../model/dao/DaoUsuario.js';
import DaoMateria from '../model/dao/DaoMateria.js';

export default function Home() {
  const { id } = useParams();
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();

  const daoUsuario = useMemo(() => new DaoUsuario(), []);
  const daoMateria = useMemo(() => new DaoMateria(), []);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [novaMateria, setNovaMateria] = useState({ nome: '', descricao: '' });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u && u.uid === id) {
        setUser(u);
        try {
          const perfil = await daoUsuario.obterUsuarioPeloId(u.uid);
          setUsuarioData(perfil);
          const mats = await daoMateria.obterMateriasPorUsuario(db, u.uid);
          setMaterias(mats);
        } catch (e) {
          console.error(e);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth, id, daoUsuario, daoMateria, db]);

  if (loading)          return <div>Carregando...</div>;
  if (!user)            return <Navigate to="/" replace />;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const salvarMateria = async () => {
    if (!novaMateria.nome || !novaMateria.descricao) {
      return alert('Preencha todos os campos');
    }
    const path = `usuarios/${id}/materias`;
    if (editando) {
      const { id: mid, index } = editando;
      await daoMateria.atualizarMateria(db, id, { id: mid, ...novaMateria, criadoEm: Date.now() });
      setMaterias(prev => prev.map((m, i) => i === index ? { id: mid, ...novaMateria } : m));
    } else {
      const key = await daoMateria.criarMateria(db, id, { ...novaMateria, criadoEm: Date.now() });
      setMaterias(prev => [...prev, { id: key, ...novaMateria }]);
    }
    setEditando(null);
    setNovaMateria({ nome: '', descricao: '' });
    setShowModal(false);
  };

  const excluirMateria = async (mid, idx) => {
    if (!window.confirm('Confirma exclusão?')) return;
    await daoMateria.excluirMateria(db, id, mid);
    setMaterias(prev => prev.filter((_, i) => i !== idx));
  };

  const abrirModalEdicao = (m, idx) => {
    setEditando({ id: m.id, index: idx });
    setNovaMateria({ nome: m.nome, descricao: m.descricao });
    setShowModal(true);
  };

  return (
      <div className="home-container">
        <header>
          <h2>Bem-vindo, {usuarioData?.nome}!</h2>
          <button onClick={handleLogout}>Logout</button>
        </header>

        <section>
          <h3>Minhas Matérias</h3>
          <button onClick={() => setShowModal(true)}>+ Nova Matéria</button>

        </section>
        {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h4>{editando ? 'Editar Matéria' : 'Nova Matéria'}</h4>
                <label>
                  Nome:
                  <input
                      value={novaMateria.nome}
                      onChange={e => setNovaMateria(p => ({ ...p, nome: e.target.value }))}
                  />
                </label>
                <label>
                  Descrição:
                  <input
                      value={novaMateria.descricao}
                      onChange={e => setNovaMateria(p => ({ ...p, descricao: e.target.value }))}
                  />
                </label>
                <div>
                  <button onClick={salvarMateria}>Salvar</button>
                  <button onClick={() => { setShowModal(false); setEditando(null); }}>Cancelar</button>
                </div>
              </div>
            </div>
        )}


        <section className="cards-container">
          {materias.map((m, i) => (
              <div key={m.id} className="card">
                <h3>{m.nome}</h3>
                <p>{m.descricao}</p>
                <button onClick={() => navigate(`/home/${id}/materia/${m.id}`)}>
                  Ver Detalhes
                </button>
              </div>
          ))}
        </section>

        {/* Modal de criação/edição permanece igual */}
      </div>


  );
}