import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import DaoMateria from "../model/materia/DaoMateria.js";
import {
  NotificationContainer,
  notifyWarning,
  notifyError,
  notifySuccess,
} from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";
import Header from "../components/Header";
import UseAppActions from "../hooks/useAppActions";

export default function Materias() {
  const { id } = useParams();
  const auth = getAuth();
  const appActions = UseAppActions();
  const [loading, setLoading] = useState(false);
  const [modalCriarMateria, setModalCriarMateria] = useState(false);
  const [materias, setMaterias] = useState([]);
  const daoUsuario = new DaoUsuario();
  const daoMateria = new DaoMateria();
  const [user, setUser] = useState({
    id: "",
    nome: "",
    dataNasc: "",
    email: "",
  });
  const [materia, setMateria] = useState({
    id: "",
    nome: "",
    descricao: "",
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      if (u && u.uid === id) {
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
        } finally {
          consultarMaterias();
        }
      } else {
        appActions.handleLogout();
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth, id]);

  const consultarMaterias = async () => {
    setLoading(true);
    try {
      const mats = await daoMateria.consultarPorUsuario(id);
      setMaterias(mats);
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const salvarMudancas = async () => {
    try {
      setLoading(true);
      if (!materia.nome || !materia.descricao) {
        notifyWarning("Preencha todos os campos!");
        return;
      }
      if (materia.id === "") {
        await daoMateria.criar(user.id, materia);
      } else {
        await daoMateria.editar(user.id, materia);
      }
      setModalCriarMateria(false);
      setMateria({
        id: "",
        nome: "",
        descricao: "",
      });
      notifySuccess("Dados salvos!");
      consultarMaterias(user.id);
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirMateria = async (idMateria) => {
    try {
      setLoading(true);
      await daoMateria.excluir(user.id, idMateria);
      notifySuccess("Matéria excluída!");
      consultarMaterias(user.id);
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const abrirFecharModalCriacaoMateria = (trueOrFalse) => {
    setModalCriarMateria(trueOrFalse);
    setMateria({
      id: "",
      nome: "",
      descricao: "",
    });
  };

  return (
    <>
      <div className="container">
        <Header
          nomeUsuario={user.nome}
          onLogout={() => appActions.handleLogout()}
          goToMaterias={() => appActions.goToMaterias(user.id)}
          goToHome={() => appActions.goToHome(user.id)}
        />
        <div className="pb-3 d-flex justify-content-end">
          <button onClick={() => setModalCriarMateria(true)} type="button" className="btn btn-primary">Adicionar Matéria</button>
        </div>
        <div className="row">
          {materias &&
            materias.map((mat, index) => (
              <div className="col-md-4 col-sm-12 pb-4">
                <div key={index} className="card text-center">
                  <div className="card-header">
                    {mat.nome}
                  </div>
                  <div className="card-body">
                    <p className="card-text">{mat.descricao}</p>
                    <a onClick={() => appActions.goToMateria(user.id, mat.id)} className="btn btn-primary me-1">Acessar</a>
                    <a onClick={() => excluirMateria(mat.id)} className="btn btn-danger">Excluir</a>
                  </div>
                </div>
              </div>
            ))}

        </div>

        {modalCriarMateria && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Dados da Matéria</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => abrirFecharModalCriacaoMateria(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      value={materia.nome}
                      onChange={(e) =>
                        setMateria({
                          ...materia,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descricao</label>
                    <textarea
                      className="form-control"
                      aria-label="With textarea"
                      value={materia.descricao}
                      onChange={(e) =>
                        setMateria({
                          ...materia,
                          descricao: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => abrirFecharModalCriacaoMateria(false)}
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
