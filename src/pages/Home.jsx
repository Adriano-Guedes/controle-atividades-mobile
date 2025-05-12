import { useState, useEffect, useMemo } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase } from "firebase/database";
import DaoUsuario from "../model/dao/DaoUsuario.js";
import DaoMateria from "../model/dao/DaoMateria.js";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [novaMateria, setNovaMateria] = useState({ nome: "", descricao: "" });
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

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/" replace />;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const salvarMateria = async () => {
    if (!novaMateria.nome || !novaMateria.descricao) {
      return alert("Preencha todos os campos");
    }
    const path = `usuarios/${id}/materias`;
    if (editando) {
      const { id: mid, index } = editando;
      await daoMateria.atualizarMateria(db, id, {
        id: mid,
        ...novaMateria,
        criadoEm: Date.now(),
      });
      setMaterias((prev) =>
        prev.map((m, i) => (i === index ? { id: mid, ...novaMateria } : m))
      );
    } else {
      const key = await daoMateria.criarMateria(db, id, {
        ...novaMateria,
        criadoEm: Date.now(),
      });
      setMaterias((prev) => [...prev, { id: key, ...novaMateria }]);
    }
    setEditando(null);
    setNovaMateria({ nome: "", descricao: "" });
    setShowModal(false);
  };

  const excluirMateria = async (mid, idx) => {
    if (!window.confirm("Confirma exclusão?")) return;
    await daoMateria.excluirMateria(db, id, mid);
    setMaterias((prev) => prev.filter((_, i) => i !== idx));
  };

  const abrirModalEdicao = (m, idx) => {
    setEditando({ id: m.id, index: idx });
    setNovaMateria({ nome: m.nome, descricao: m.descricao });
    setShowModal(true);
  };

  return (
    <div className="home-container">
      <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        {" "}
        <a
          href="/"
          class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          {" "}
          <span class="fs-4">Bem-vindo, {usuarioData?.nome}!</span>{" "}
        </a>{" "}
        <ul class="nav nav-pills">
          {" "}
          <li class="nav-item">
            <a onClick={handleLogout} class="nav-link active" aria-current="page">
              Sair
            </a>
          </li>{" "}
        </ul>{" "}
      </header>

      <section>
        <div class="row">
          <div class="col-sm-10 mb-3 mb-sm-0">
            <h3>Minhas Matérias</h3>
            
          </div>
          <div class="col-sm-2 mb-3 mb-sm-0">
            <button onClick={() => setShowModal(true)} type="button" class="btn btn-success">
              + Nova Matéria
            </button>
          </div>
        </div>
      </section>

      <div class="row">
        {materias.map((m, i) => (
          <div class="col-sm-4 mb-3 mb-sm-0">
            <div class="card">
              <div class="card-body" key={m.id}>
                <h5 class="card-title">{m.nome}</h5>
                <p class="card-text">{m.descricao}</p>
                <a
                  href="#"
                  class="btn btn-primary"
                  onClick={() => navigate(`/home/${id}/materia/${m.id}`)}
                >
                  Detalhes
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>{editando ? "Editar Matéria" : "Nova Matéria"}</h4>
            <label>
              Nome:
              <input
                value={novaMateria.nome}
                onChange={(e) =>
                  setNovaMateria((p) => ({ ...p, nome: e.target.value }))
                }
              />
            </label>
            <label>
              Descrição:
              <input
                value={novaMateria.descricao}
                onChange={(e) =>
                  setNovaMateria((p) => ({ ...p, descricao: e.target.value }))
                }
              />
            </label>
            <div>
              <button onClick={salvarMateria}>Salvar</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditando(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
