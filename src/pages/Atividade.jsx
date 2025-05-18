import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import DaoAtividade from "../model/atividade/DaoAtividade.js";
import DaoRegistro from "../model/registro/DaoRegistro.js";
import {
    NotificationContainer,
    notifyWarning,
    notifyError,
    notifySuccess,
} from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";
import Header from "../components/Header";
import UseAppActions from "../hooks/useAppActions";

export default function Atividade() {
    const { id, materiaId, atividadeId } = useParams();
    const auth = getAuth();
    const [loading, setLoading] = useState(true);
    const appActions = UseAppActions();
    const [user, setUser] = useState(null);
    const [atividade, setAtividade] = useState(null);
    const [registros, setRegistros] = useState([]);
    const daoUsuario = new DaoUsuario();
    const daoAtividade = useMemo(() => new DaoAtividade(), []);
    const daoRegistro = useMemo(() => new DaoRegistro(), []);
    const [modalDadosAtividade, setModalDadosAtividade] = useState(false);
    const [dadosEditaveisAtividade, setDadosEditaveisAtividade] = useState({
        id: "",
        nome: "",
        descricao: "",
    });
    const [modalCriarRegistro, setModalCriarRegistro] = useState(false);
    const [dadosCriarRegistro, setDadosCriarRegistro] = useState({
        data: "",
        horas: Number,
    });

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setLoading(true);
            if (u && u.uid === id) {
                try {
                    const dadosUsuario = await daoUsuario.consultarPorId(id);
                    const dadosAtividade = await daoAtividade.consultarPorId(id, materiaId, atividadeId);

                    setUser({
                        id: dadosUsuario.id,
                        nome: dadosUsuario.nome,
                        dataNasc: dadosUsuario.dataNasc,
                        email: dadosUsuario.email,
                    });

                    setAtividade({
                        nome: dadosAtividade.nome,
                        descricao: dadosAtividade.descricao,
                    });

                    await atualizarListaRegistros();

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
    }, [auth, id, materiaId, atividadeId]);

    const abrirModalAtividade = (nome, desc) => {
        setModalDadosAtividade(true);
        setDadosEditaveisAtividade({
            nome: nome,
            descricao: desc,
        });
    };

    const abrirFecharModalCriacaoRegistro = (trueOrFalse) => {
        setModalCriarRegistro(trueOrFalse);
        setDadosCriarRegistro({
            data: "",
            horas: 0,
        });
    };

    const atualizarDadosAtividade = async () => {
        try {
            setLoading(true);
            if (!dadosEditaveisAtividade.nome || !dadosEditaveisAtividade.descricao) {
                notifyWarning("Preencha todos os campos!");
                return;
            }
            dadosEditaveisAtividade.id = atividadeId;
            const atividadeAtualizada = await daoAtividade.editar(
                id,
                materiaId,
                atividadeId,
                dadosEditaveisAtividade
            );
            setAtividade({
                id: atividadeAtualizada.id,
                nome: atividadeAtualizada.nome,
                descricao: atividadeAtualizada.descricao,
            });
            setModalDadosAtividade(false);
            notifySuccess("Dados atualizados!");
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const criarRegistro = async () => {
        try {
            setLoading(true);
            if (!dadosCriarRegistro.data || !dadosCriarRegistro.horas) {
                notifyWarning("Preencha todos os campos!");
                return;
            }
            await daoRegistro.criar(id, materiaId, atividadeId, dadosCriarRegistro);
            abrirFecharModalCriacaoRegistro(false);
            atualizarListaRegistros();
            notifySuccess("Registro criada com sucesso!");
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const atualizarListaRegistros = async () => {
        try {
            setLoading(true);
            const regs = await daoRegistro.consultarPorAtividade(id, materiaId, atividadeId);
            setRegistros(regs);
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const voltarParaMateria = () => {
        appActions.goToMateria(id, materiaId);
    }

    const excluirRegistro = async (regId) => {
        try {
            setLoading(true);
            await daoRegistro.excluir(id, materiaId, atividadeId, regId);
            atualizarListaRegistros();
            notifySuccess("Registro excluído com sucesso!");
        } catch (error) {
            notifyError(error.message);
        } finally {
            setLoading(false);
        }
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

                {atividade && (
                    <div className="card">
                        <h5 className="card-header">{atividade.nome}</h5>
                        <div className="card-body">
                            <p className="card-text">{atividade.descricao}</p>
                            <div className="d-flex justify-content-end">
                                <button
                                    onClick={() =>
                                        abrirModalAtividade(atividade.nome, atividade.descricao)
                                    }
                                    type="button"
                                    className="btn btn-primary me-1"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => abrirFecharModalCriacaoRegistro(true)}
                                    type="button"
                                    className="btn btn-primary me-1"
                                >
                                    Adicionar Registro
                                </button>
                                <button
                                    onClick={() => voltarParaMateria()}
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
                    <h5 className="card-header">Registros</h5>
                    <div className="card-body">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>Data</th>
                                    <th>Horas</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.map((registro, index) => (
                                    <tr
                                        key={index}
                                    >
                                        <td>{registro.data}</td>
                                        <td>{registro.horas}</td>
                                        <td><button
                                            onClick={() => excluirRegistro(registro.id)}
                                            type="button"
                                            className="btn btn-danger"
                                        >
                                            Excluir
                                        </button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {modalDadosAtividade && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Dados da Atividade</h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setModalDadosAtividade(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={dadosEditaveisAtividade.nome}
                                            onChange={(e) =>
                                                setDadosEditaveisAtividade({
                                                    ...dadosEditaveisAtividade,
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
                                            value={dadosEditaveisAtividade.descricao}
                                            onChange={(e) =>
                                                setDadosEditaveisAtividade({
                                                    ...dadosEditaveisAtividade,
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
                                            setModalDadosAtividade(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => atualizarDadosAtividade()}
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {modalCriarRegistro && (
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5">Criar Registro</h1>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() =>
                                            abrirFecharModalCriacaoRegistro(false)}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Data</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={dadosCriarRegistro.data}
                                            onChange={(e) =>
                                                setDadosCriarRegistro({
                                                    ...dadosCriarRegistro,
                                                    data: e.target.value,
                                                })
                                            }
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Horas</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={dadosCriarRegistro.horas}
                                            onChange={(e) =>
                                                setDadosCriarRegistro({
                                                    ...dadosCriarRegistro,
                                                    horas: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => abrirFecharModalCriacaoRegistro(false)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => criarRegistro()}
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
