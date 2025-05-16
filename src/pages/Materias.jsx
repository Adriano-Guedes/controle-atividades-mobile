import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import DaoMateria from "../model/materia/DaoMateria.js"
import {
    NotificationContainer,
    notifyWarning,
    notifyError,
    notifySuccess,
  } from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";
import Header from "../components/Header";
import UseAppActions from "../hooks/useAppActions";

export default function Materias(){
    const { id } = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const appActions = UseAppActions();
    const [loading, setLoading] = useState(false);
    const [materias, setMaterias] = useState([]);
    const daoUsuario = new DaoUsuario();
    const daoMateria = new DaoMateria();
    const [user, setUser] = useState({
    id: "",
    nome: "",
    dataNasc: "",
    email: "",
    });
    const [newMateria, setNewMateria] = useState({
    nome: "",
    descricao: "",
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
                } finally{
                    consultarMaterias(dados.id);
                }
            } else {
                appActions.handleLogout();
            }
            setLoading(false);
        });
        return () => unsub();
    }, [auth, id]);

    // const handleLogout = async () => {
    // await signOut(auth);
    // navigate("/");
    // };

    // const goToMaterias = async () => {
    //     navigate(`/home/${user.id}/materias`);
    //     };

    // const goToHome = async () => {
    //     navigate(`/home/${user.id}`);
    //     };

    const consultarMaterias = async (id) => {
        setLoading(true);
        try {
          const mats = await daoMateria.consultarPorUsuario(id);
          console.log(mats);
          setMaterias(mats);
        } catch (error) {
          notifyError(error.message);
        } finally {
          setLoading(false);
        }
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


            {materias && materias.map((materia, index) => (
            <div key={index} className="card" style={{ width: "18rem", marginBottom: "1rem" }}>
                <div className="card-body">
                <h5 className="card-title">{materia.nome}</h5>
                <p className="card-text">{materia.descricao}</p>
                <a href="#" className="card-link" onClick={(e) => e.preventDefault()}>Card link</a>
                <a href="#" className="card-link" onClick={(e) => e.preventDefault()}>Another link</a>
                </div>
            </div>
            ))}


          </div>
          <NotificationContainer />
          <LoadingModal visible={loading} text="Aguarde..." />
        </>
      );
    
}