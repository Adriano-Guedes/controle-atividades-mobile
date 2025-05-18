import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import DaoMateria from "../model/materia/DaoMateria.js";
import DaoAtividade from "../model/atividade/DaoAtividade.js";
import DaoRegistro from "../model/registro/DaoRegistro.js";
import { NotificationContainer, notifyWarning, notifyError, notifySuccess } from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";
import Header from "../components/Header";
import UseAppActions from "../hooks/useAppActions";

export default function Materia() {
    const { id, materiaId } = useParams();
    const auth = getAuth();
    const [loading, setLoading] = useState(true);
    const appActions = UseAppActions();
    const [user, setUser] = useState(null);
    const [materia, setMateria] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const daoUsuario = new DaoUsuario();
    const daoMateria = useMemo(() => new DaoMateria(), []);
    const daoAtividade = useMemo(() => new DaoAtividade(), []);
    const daoRegistro = useMemo(() => new DaoRegistro(), []);
    const [modalDadosMateria, setModalDadosMateria] = useState(false);
    const [dadosEditaveisMateria, setDadosEditaveisMateria] = useState({
        id: "",
        nome: "",
        descricao: "",
    });
    const [modalCriarAtividade, setModalCriarAtividade] = useState(false);
    const [dadosCriarAtividade, setDadosCriarAtividade] = useState({
        nome: "",
        descricao: "",
    });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setLoading(true);
            if (u && u.uid === id) {
                try {
                    const dadosUsuario = await daoUsuario.consultarPorId(id);

                    const dadosMateria = await daoMateria.consultarPorId(id, materiaId);

                    const atvs = await daoAtividade.consultarPorMateria(id, materiaId);

                    setUser({
                        id: dadosUsuario.id,
                        nome: dadosUsuario.nome,
                        dataNasc: dadosUsuario.dataNasc,
                        email: dadosUsuario.email,
                    });
                    setMateria({
                        id: dadosMateria.id,
                        nome: dadosMateria.nome,
                        descricao: dadosMateria.descricao,
                    });
                    setAtividades(atvs);
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
    }, [auth, id, materiaId]);

    const atualizarListaAtividades = async () => {
        try {
            const atvs = await daoAtividade.consultarPorMateria(id, materiaId);
            setAtividades(atvs);
        } catch (error) {
            notifyError(error.message);
        }
    }

    const abrirModalMateria = (nome, desc) => {
        setModalDadosMateria(true);
        setDadosEditaveisMateria({
            nome: nome,
            descricao: desc,
        });
    };

    const atualizarDadosMateria = async () => {
        try {
            setLoading(true);
            if (!dadosEditaveisMateria.nome || !dadosEditaveisMateria.descricao) {
                notifyWarning("Preencha todos os campos!");
                return;
            }
            dadosEditaveisMateria.id = materiaId;
            const materiaAtualizada = await daoMateria.editar(
                id,
                dadosEditaveisMateria
            );
            setMateria({
                id: materiaAtualizada.id,
                nome: materiaAtualizada.nome,
                descricao: materiaAtualizada.descricao,
            });
            setModalDadosMateria(false);
            notifySuccess("Dados atualizados!");
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const criarAtividade = async () => {
        try {
            setLoading(true);
            if (!dadosCriarAtividade.nome || !dadosCriarAtividade.descricao) {
                notifyWarning("Preencha todos os campos!");
                return;
            }
            const atividade = await daoAtividade.criar(id, materiaId, dadosCriarAtividade);
            abrirFecharModalCriacaoAtividade(false);
            atualizarListaAtividades();
            notifySuccess("Atividade criada com sucesso!");
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const abrirFecharModalCriacaoAtividade = (trueOrFalse) => {
        setModalCriarAtividade(trueOrFalse);
        setDadosCriarAtividade({
            nome: "",
            descricao: "",
        });
    };

    const voltarParaMaterias = () => {
        appActions.goToMaterias(id);
    }

    return (
        <>
            <div className="container">
                {user && (
                    <Header
                        nomeUsuario={user.nome}
                        onLogout={() => appActions.handleLogout()}
                        goToMaterias={() => appActions.goToMaterias(user.id)}
                        goToHome={() => appActions.goToHome(user.id)}
                    />
                )}

                {materia && (
                    <div className="card">
                        <h5 className="card-header">{materia.nome}</h5>
                        <div className="card-body">
                            <p className="card-text">{materia.descricao}</p>
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() =>
                                        abrirModalMateria(materia.nome, materia.descricao)
                                    }
                                    type="button"
                                    className="btn btn-primary me-1"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => abrirFecharModalCriacaoAtividade(true)}
                                    type="button"
                                    className="btn btn-primary me-1"
                                >
                                    Adicionar Atividade
                                </button>
                                <button
                                    onClick={() => voltarParaMaterias()}
                                    type="button"
                                    className="btn btn-primary"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                <div className="card">
                    <h5 className="card-header">Atividades</h5>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                </tr>
                            </thead>
                            <tbody>
                                {atividades.map((atividade, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => appActions.goToAtividade(id, materiaId, atividade.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{atividade.nome}</td>
                                        <td>{atividade.descricao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {modalDadosMateria && (
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
                                        onClick={() => setModalDadosMateria(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={dadosEditaveisMateria.nome}
                                            onChange={(e) =>
                                                setDadosEditaveisMateria({
                                                    ...dadosEditaveisMateria,
                                                    nome: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descrição</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={dadosEditaveisMateria.descricao}
                                            onChange={(e) =>
                                                setDadosEditaveisMateria({
                                                    ...dadosEditaveisMateria,
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
                                        onClick={() => {
                                            setModalDadosMateria(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => atualizarDadosMateria()}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modalCriarAtividade && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Criar Atividade</h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            abrirFecharModalCriacaoAtividade(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={dadosCriarAtividade.nome}
                                            onChange={(e) =>
                                                setDadosCriarAtividade({
                                                    ...dadosCriarAtividade,
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
                                            value={dadosCriarAtividade.descricao}
                                            onChange={(e) =>
                                                setDadosCriarAtividade({
                                                    ...dadosCriarAtividade,
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
                                        onClick={() => abrirFecharModalCriacaoAtividade(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => criarAtividade()}
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
