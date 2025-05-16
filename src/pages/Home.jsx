import { useState, useEffect, useMemo, use } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import UsuarioID from "../model/usuario/UsuarioId.js";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import {
  NotificationContainer,
  notifyWarning,
  notifyError,
  notifySuccess,
} from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";

export default function Home() {
  const { id } = useParams();
  const auth = getAuth();
  const navigate = useNavigate();
  const daoUsuario = new DaoUsuario();
  const [user, setUser] = useState({
    id: "",
    nome: "",
    dataNasc: "",
    email: "",
  });
  const [modalDadosUsuario, setModalDadosUsuario] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [dadosEditaveis, setDadosEditaveis] = useState({
    nome: "",
    email: "",
    dataNasc: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      if (u && u.uid === id) {
        setUser(u);
        try {
          var dados = await daoUsuario.consultarPorId(u.uid);
          setUser({
            id: dados.id,
            nome: dados.nome,
            dataNasc: dados.dataNasc,
            email: dados.email,
          });
        } catch (error) {
          notifyError(error.message);
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth, id]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const salvarMudancas = async () => {
    try {
      setLoading(true);
      if (
        !dadosEditaveis.nome ||
        !dadosEditaveis.email ||
        !dadosEditaveis.dataNasc
      ) {
        notifyWarning("Preencha todos os campos!");
        return;
      }
      await daoUsuario.editar(user.id, dadosEditaveis);
      setUser({ ...user, ...dadosEditaveis });
      setModoEdicao(false);
      setModalDadosUsuario(false);
      notifySuccess("Dados atualizados!");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = () => {
    setDadosEditaveis({
      nome: user.nome,
      email: user.email,
      dataNasc: formatarDataParaISO(user.dataNasc),
    });
    setModoEdicao(false);
    setModalDadosUsuario(true);
  };

  const irParaMaterias = () => {
    navigate(`/home/${user.id}/materia`);
  };

  function formatarDataParaISO(data) {
    // Verifica se já está no formato ISO (yyyy-mm-dd)
    const regexISO = /^\d{4}-\d{2}-\d{2}$/;
    if (regexISO.test(data)) {
      return data;
    }
  
    // Caso contrário, tenta converter de dd/mm/yyyy
    const regexBR = /^\d{2}\/\d{2}\/\d{4}$/;
    if (regexBR.test(data)) {
      const [dia, mes, ano] = data.split("/");
      return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }
  
    // Se não for nenhum dos formatos esperados, retorna string vazia ou lança erro
    console.warn("Formato de data inválido:", data);
    return "";
  }
  
  

  return (
    <>
      <div className="container">
        <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a
            onClick={(e) => e.preventDefault()}
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
          >
            <span className="fs-4">{user.nome}</span>
          </a>
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => handleLogout()}
              >
                Sair
              </button>
            </li>
          </ul>
        </header>

        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          <div className="col d-flex align-items-start">
            <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"></div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Dados usuário</h3>
              <p>Visualizar e editar dados do usuário.</p>
              <button onClick={() => abrirModal()} className="btn btn-primary">
                Abrir
              </button>
            </div>
          </div>

          <div className="col d-flex align-items-start">
            <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3"></div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Matérias</h3>
              <p>Ir para a listagem de matérias do usuário.</p>
              <button
                onClick={() => irParaMaterias()}
                className="btn btn-primary"
              >
                Acessar
              </button>
            </div>
          </div>
        </div>

        {modalDadosUsuario && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Dados do usuário</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setModalDadosUsuario(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      value={dadosEditaveis.nome}
                      disabled={!modoEdicao}
                      onChange={(e) =>
                        setDadosEditaveis({
                          ...dadosEditaveis,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={dadosEditaveis.email}
                      disabled={!modoEdicao}
                      onChange={(e) =>
                        setDadosEditaveis({
                          ...dadosEditaveis,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dadosEditaveis.dataNasc}
                      disabled={!modoEdicao}
                      onChange={(e) =>
                        setDadosEditaveis({
                          ...dadosEditaveis,
                          dataNasc: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  {!modoEdicao ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setModoEdicao(true)}
                    >
                      Editar
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setModoEdicao(false);
                          setDadosEditaveis({
                            nome: user.nome,
                            email: user.email,
                            dataNasc: user.dataNasc,
                          });
                        }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => salvarMudancas()}
                      >
                        Salvar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <NotificationContainer />
      <LoadingModal visible={loading} text="Aguarde..." />
    </>
  );
}
