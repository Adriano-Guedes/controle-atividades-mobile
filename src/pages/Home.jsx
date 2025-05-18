import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import {
  NotificationContainer,
  notifyWarning,
  notifyError,
  notifySuccess,
} from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";
import Header from "../components/Header";
import UseAppActions from "../hooks/useAppActions";

export default function Home() {
  const { id } = useParams();
  const auth = getAuth();
  const appActions = UseAppActions();
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
          var dados = await daoUsuario.consultarPorId(id);
          setUser({
            id: dados.id,
            nome: dados.nome,
            dataNasc: dados.dataNasc,
            email: dados.email,
          });
        } catch (error) {
          notifyError(error.message);
          appActions.handleLogout();
        }
      } else {
        appActions.handleLogout();
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth, id]);

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

  function formatarDataParaISO(data) {
    const regexISO = /^\d{4}-\d{2}-\d{2}$/;
    if (regexISO.test(data)) {
      return data;
    }
    const regexBR = /^\d{2}\/\d{2}\/\d{4}$/;
    if (regexBR.test(data)) {
      const [dia, mes, ano] = data.split("/");
      return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
    }
    console.warn("Formato de data inválido:", data);
    return "";
  }


  return (
    <>
      <div className="container">
      <Header
        nomeUsuario={user.nome}
        onLogout={() => appActions.handleLogout()}
        goToMaterias={() => appActions.goToMaterias(user.id)}
        goToHome={() => appActions.goToHome(user.id)}
        />

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
                onClick={() => appActions.goToMaterias(user.id)}
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
