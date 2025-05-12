import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const navigate = useNavigate();

  const cadastrar = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await set(ref(database, `usuarios/${user.uid}`), {
        nome,
        data_nasc: dataNasc,
        email
      });

      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      console.error(error.message);
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Cadastro</h2>
      <input placeholder="Nome" onChange={e => setNome(e.target.value)} />
      <input placeholder="Data de nascimento" type="date" onChange={e => setDataNasc(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setSenha(e.target.value)} />
      <button onClick={cadastrar}>Cadastrar</button>
      <p />
      <button onClick={() => navigate('/')}>Voltar para Login</button>
    </div>
  );
}
