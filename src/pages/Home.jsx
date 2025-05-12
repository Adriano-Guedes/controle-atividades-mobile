import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, get, push, set, remove } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import DaoUsuario from "../model/dao/DaoUsuario.js";
// import DaoMateria from "../model/dao/DaoMateria.js";
// import DaoAtividade from "../model/dao/DaoAtividade.js";
// import DaoRegistro from "../model/dao/DaoRegistro.js";
// import Usuario from "../model/Usuario.js";
// import Materia from "../model/Materia.js";
// import Atividade from "../model/Atividade.js";
// import Registro from "../model/Registro.js";
import './css/Home.css';

export default function Home() {
  const [userData, setUserData] = useState(null);
  const [usuarioData, setUsuarioData] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [showModalAdicionarMateria, setShowModalAdicionarMateria] = useState(false);
  const [novaMateria, setNovaMateria] = useState({ nome: '', descricao: '' });
  const navigate = useNavigate();
  const daoUsuario = new DaoUsuario();
  const [editandoMateria, setEditandoMateria] = useState(null);

  // const daoMateria = new DaoMateria();
  // const daoAtividade = new DaoAtividade();
  // const daoRegistro = new DaoRegistro();
  // const usuario = new Usuario();
  // const materia = new Materia();
  // const atividade = new Atividade();
  // const registro = new Registro();

  const auth = getAuth();
  const db = getDatabase();
  const userId = auth.currentUser.uid;

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user);

        daoUsuario.obterUsuarioPeloId(user.uid)
          .then((usuarioData) => {
            if (usuarioData) {
              setUsuarioData(usuarioData);

              const userRef = ref(db, `usuarios/${user.uid}/materias`);
              get(userRef)
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    const data = snapshot.val();
                    const lista = Object.keys(data).map((key) => ({
                      id: key,
                      ...data[key],
                    }));
                    setMaterias(lista);

                  } else {
                    setMaterias([]);
                  }
                })
                .catch((error) => {
                  console.error('Erro ao recuperar as matérias:', error);
                });
            } else {
              console.error('Usuário não encontrado no banco de dados.');
            }
          })
          .catch((error) => {
            console.error('Erro ao obter dados do usuário:', error);
          });
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();

  }, [navigate]);

  useEffect(() => {
    if (editandoMateria) {
      setNovaMateria({ nome: editandoMateria.nome, descricao: editandoMateria.descricao });
    }
  }, [editandoMateria]);

  const formatarData = (data) => {
    const date = new Date(data);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleMateriaChange = (e) => {
    const { name, value } = e.target;
    setNovaMateria((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdicionarAtividade = (materia) => {
    navigate(`/materia/${materia.id || materia.nome}/atividade`);
  };

  const handleEditarMateria = (materia, index) => {
    setEditandoMateria({ ...materia, index });
    setShowModalAdicionarMateria(true);
  };  

  const handleSaveMateria = () => {
    const materiasRef = ref(db, `usuarios/${userId}/materias`);

    if (novaMateria.nome && novaMateria.descricao) {
      if (editandoMateria) {
        // Atualiza no Firebase (assumindo que cada matéria tem um ID)
        const key = editandoMateria.id; // ou use o index para acessar direto em Object.keys se necessário
        const materiaRef = ref(db, `usuarios/${userId}/materias/${key}`);
        set(materiaRef, novaMateria)
          .then(() => {
            const novas = [...materias];
            novas[editandoMateria.index] = novaMateria;
            setMaterias(novas);
            setShowModalAdicionarMateria(false);
            setNovaMateria({ nome: '', descricao: '' });
            setEditandoMateria(null);
          })
          .catch((error) => {
            console.error('Erro ao atualizar a matéria:', error);
          });
      } else {
        // Cria nova matéria
        push(materiasRef, novaMateria)
          .then(() => {
            setMaterias((prev) => [...prev, novaMateria]);
            setShowModalAdicionarMateria(false);
            setNovaMateria({ nome: '', descricao: '' });
          })
          .catch((error) => {
            console.error('Erro ao salvar a matéria:', error);
          });
      }
    } else {
      console.error('Por favor, preencha todos os campos.');
    }
  };

  const handleExcluirMateria = (materia, index) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir a matéria "${materia.nome}"?`);
    if (!confirmar) return;

    const key = materia.id;

    const materiaRef = ref(db, `usuarios/${userId}/materias/${key}`);
    remove(materiaRef)
      .then(() => {
        const novasMaterias = [...materias];
        novasMaterias.splice(index, 1);
        setMaterias(novasMaterias);
      })
      .catch((error) => {
        console.error('Erro ao excluir matéria:', error);
      });
  };


  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <h2>Bem-vindo, {usuarioData?.nome}!</h2>
      <p>Email: {usuarioData?.email}</p>
      <p>Data de Nascimento: {usuarioData?.data_nasc ? formatarData(usuarioData.data_nasc) : 'Não informada'}</p>

      <h3>Minhas Matérias</h3>
      <h3>Minhas Matérias</h3>
      {materias.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((materia, index) => (
              <tr key={index}>
                <td>{materia.nome}</td>
                <td>{materia.descricao}</td>
                <td>
                  <button onClick={() => handleAdicionarAtividade(materia)}>Atividades</button>
                  <button onClick={() => handleEditarMateria(materia, index)}>Editar</button>
                  <button onClick={() => handleExcluirMateria(materia, index)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Você ainda não tem matérias cadastradas.</p>
      )}


      <button onClick={() => setShowModalAdicionarMateria(true)}>Adicionar Matéria</button>
      <button onClick={handleLogout}>Logout</button>

      {/* Modal Adicionar matéria */}
      {showModalAdicionarMateria && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModalAdicionarMateria(false)}>&times;</span>
            <h3>Adicionar Nova Matéria</h3>
            <form>
              <div>
                <label>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={novaMateria.nome}
                  onChange={handleMateriaChange}
                />
              </div>
              <div>
                <label>Descrição:</label>
                <input
                  type="text"
                  name="descricao"
                  value={novaMateria.descricao}
                  onChange={handleMateriaChange}
                />
              </div>
              <button type="button" onClick={handleSaveMateria}>Salvar</button>
              <button type="button" onClick={() => setShowModalAdicionarMateria(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}