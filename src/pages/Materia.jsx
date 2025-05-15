
import { useState, useEffect, useMemo } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import DaoMateria from '../model/materia/DaoMateria.js';
import DaoAssunto from '../model/assunto/DaoAtividade.js';
import DaoRegistro from '../model/registro/DaoRegistro.js';
import Assunto from '../model/assunto/Atividade.js';

export default function Materia() {
    const { id, materiaId } = useParams();
    const auth = getAuth();
    const db = getDatabase();
    const navigate = useNavigate();

    const daoMateria = useMemo(() => new DaoMateria(), []);
    const daoAssunto = useMemo(() => new DaoAssunto(), []);
    const daoRegistro = useMemo(() => new DaoRegistro(), []);

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [materia, setMateria] = useState(null);
    const [assuntos, setAssuntos] = useState([]);
    const [registros, setRegistros] = useState([]);
    const [showAssuntoModal, setShowAssuntoModal] = useState(false);
    const [showRegistroModal, setShowRegistroModal] = useState(false);
    const [novaAssunto, setNovaAssunto] = useState('');
    const [registroHoras, setRegistroHoras] = useState(0);
    const [currentAssunto, setCurrentAssunto] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u && u.uid === id) {
                setUser(u);
                try {
                    const m = await daoMateria.obterMateriaPorId(db, id, materiaId);
                    setMateria(m);
                    const lista = await daoAssunto.listarPorMateria(db, id, materiaId);
                    setAssuntos(lista);
                } catch (e) {
                    console.error(e);
                    setMateria(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, [auth, db, daoMateria, daoAssunto, id, materiaId]);

    if (loading) return <div>Carregando...</div>;
    if (!user) return <Navigate to='/' replace />;
    if (!materia) return <div>Matéria não encontrada.</div>;

    const abrirModalAssunto = () => setShowAssuntoModal(true);
    const fecharModalAssunto = () => { setShowAssuntoModal(false); setNovaAssunto(''); };

    const salvarAssunto = async () => {
        if (!novaAssunto.trim()) return;
        const key = await daoAssunto.criar(db, id, materiaId, new Assunto(novaAssunto, Date.now()));
        setAssuntos(prev => [...prev, { id: key, nome: novaAssunto }]);
        fecharModalAssunto();
    };

    const abrirModalRegistro = async (assunto) => {
        setCurrentAssunto(assunto);
        const regs = await daoRegistro.listarPorAssunto(db, id, materiaId, assunto.id);
        setRegistros(regs);
        setShowRegistroModal(true);
    };
    const fecharModalRegistro = () => { setShowRegistroModal(false); setRegistroHoras(0); setCurrentAssunto(null); };

    const salvarRegistro = async () => {
        if (registroHoras <= 0) return;
        await daoRegistro.criar(db, id, materiaId, currentAssunto.id, registroHoras);
        const regs = await daoRegistro.listarPorAssunto(db, id, materiaId, currentAssunto.id);
        setRegistros(regs);
        fecharModalRegistro();
    };

    return (
        <div>
            <h2>{materia.nome}</h2>
            <p>{materia.descricao}</p>
            <button onClick={() => navigate(`/home/${id}`)}>Voltar</button>

            <section>
                <h3>Assuntos</h3>
                <button onClick={abrirModalAssunto}>+ Novo Assunto</button>
                <ul>
                    {assuntos.map(a => (
                        <li key={a.id}>
                            {a.nome}
                            <button onClick={() => abrirModalRegistro(a)}>Registrar Horas</button>
                        </li>
                    ))}
                </ul>
            </section>

            {showAssuntoModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h4>Novo Assunto</h4>
                        <input
                            value={novaAssunto}
                            onChange={e => setNovaAssunto(e.target.value)}
                            placeholder='Nome do assunto'
                        />
                        <button onClick={salvarAssunto}>Salvar</button>
                        <button onClick={fecharModalAssunto}>Cancelar</button>
                    </div>
                </div>
            )}

            {showRegistroModal && (
                <div className='modal'>
                    <div className='modal-content'>
                        <h4>Registro de Horas - {currentAssunto.nome}</h4>
                        <input
                            type='number'
                            value={registroHoras}
                            onChange={e => setRegistroHoras(Number(e.target.value))}
                            placeholder='Horas estudadas'
                        />
                        <button onClick={salvarRegistro}>Salvar</button>
                        <button onClick={fecharModalRegistro}>Cancelar</button>
                        <h5>Histórico de registros:</h5>
                        <ul>
                            {registros.map(r => (
                                <li key={r.id}>{r.horas}h em {new Date(r.data).toLocaleDateString()}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
