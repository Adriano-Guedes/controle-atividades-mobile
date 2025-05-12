// src/pages/Login.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate('/home');
    } catch (error) {
      console.error(error.message);
      alert('Erro no login: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setSenha(e.target.value)} />
      <button onClick={login}>Entrar</button>

      <p>Não tem uma conta?</p>
      <button onClick={() => navigate('/cadastro')}>Cadastre-se</button>
    </div>
  );
}

