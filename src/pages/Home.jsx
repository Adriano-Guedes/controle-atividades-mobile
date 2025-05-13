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
  const [showModalCriarEditarMateria, setShowModalCriarEditarMateria] = useState(false);
  const [showModalDadosUsuario, setShowModalDadosUsuario] = useState(false);
  const [novaMateria, setNovaMateria] = useState({ nome: "", descricao: "" });
  const [dadosUsuario, setDadosUsuario] = useState({ nome: "", email: "", data_nasc: ""});
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

  //if (loading) setLoading(true);
  if (!user) navigate("/");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const alterarDadosUsuario = async () => {
    setLoading(true);
  
    try {
      if (!dadosUsuario.nome || !dadosUsuario.email || !dadosUsuario.data_nasc) {
        alert("Preencha todos os campos");
        return;
      }
  
      await daoUsuario.alterar(dadosUsuario);
  
      const perfil = await daoUsuario.obterUsuarioPeloId(user.uid);
      setUsuarioData(perfil);
    } catch (error) {
      console.error("Erro ao alterar dados do usuário:", error);
      alert("Erro ao atualizar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };
  

  const salvarMateria = async () => {
    setLoading(true);
    if (!novaMateria.nome || !novaMateria.descricao) {
      return alert("Preencha todos os campos");
    }
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
    setShowModalCriarEditarMateria(false);
    setLoading(false);
  };

  const excluirMateria = async (mid, idx) => {
    setLoading(true);
    if (!window.confirm("Confirma exclusão?")) return;
    await daoMateria.excluirMateria(db, id, mid);
    setMaterias((prev) => prev.filter((_, i) => i !== idx));
    setLoading(false);
  };

  const abrirModalEdicao = (m, idx) => {
    setEditando({ id: m.id, index: idx });
    setNovaMateria({ nome: m.nome, descricao: m.descricao });
    setShowModalCriarEditarMateria(true);
  };

  return (
    <div className="container">
      <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        {" "}
        <a
          onClick={(e) => e.preventDefault()}
          class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          {" "}
          <span class="fs-4">{usuarioData?.nome}</span>{" "}
        </a>{" "}
        <ul class="nav nav-pills">
          {" "}
          <li class="nav-item">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              onClick={handleLogout}
            >
              Sair
            </button>
          </li>{" "}
        </ul>{" "}
      </header>

      <section>
        <div class="row">
          <div class="col-sm-10 mb-3 mb-sm-0">
            <h3>Minhas Matérias</h3>
          </div>
          <div class="col-sm-2 mb-3 mb-sm-0">
            <button
              onClick={() => setShowModalCriarEditarMateria(true)}
              type="button"
              class="btn btn-success"
            >
              Nova Matéria
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
                <div className="d-flex gap-2 mt-2">
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    onClick={() => navigate(`/home/${id}/materia/${m.id}`)}
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary btn-sm"
                    onClick={() => abrirModalEdicao(m, i)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    onClick={() => excluirMateria(m.id, i)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal criar/editar matéria */}
      {showModalCriarEditarMateria && (
        <>
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editando ? "Editar Matéria" : "Nova Matéria"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModalCriarEditarMateria(false);
                      setEditando(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      className="form-control"
                      value={novaMateria.nome}
                      onChange={(e) =>
                        setNovaMateria((p) => ({ ...p, nome: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <input
                      className="form-control"
                      value={novaMateria.descricao}
                      onChange={(e) =>
                        setNovaMateria((p) => ({
                          ...p,
                          descricao: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={salvarMateria} className="btn btn-primary">
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setShowModalCriarEditarMateria(false);
                      setEditando(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Modal dados usuário */}
      {showModalDadosUsuario && (
        <>
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editando ? "Editar Matéria" : "Nova Matéria"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModalDadosUsuario(false);
                      setEditando(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      className="form-control"
                      value={novaMateria.nome}
                      onChange={(e) =>
                        setNovaMateria((p) => ({ ...p, nome: e.target.value }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <input
                      className="form-control"
                      value={novaMateria.descricao}
                      onChange={(e) =>
                        setNovaMateria((p) => ({
                          ...p,
                          descricao: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={salvarMateria} className="btn btn-primary">
                    Salvar
                  </button>
                  <button
                    onClick={() => {
                      setShowModalDadosUsuario(false);
                      setEditando(null);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Modal loading */}
      {loading && (
        <>
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-sm modal-dialog-centered">
              <div className="modal-content text-center p-4">
                <div
                  className="spinner-border text-primary mb-3"
                  role="status"
                />
                <h5>Carregando...</h5>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}
