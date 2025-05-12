import { useState }                   from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth }                       from '../services/firebase.js';
import { useNavigate }                from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            const cred = await signInWithEmailAndPassword(auth, email, senha);
            navigate(`/home/${cred.user.uid}`);
        } catch (error) {
            alert('Erro no login: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={e => setSenha(e.target.value)}
            />
            <button onClick={login}>Entrar</button>
            <p>Não tem conta?</p>
            <button onClick={() => navigate('/cadastro')}>Cadastre-se</button>
        </div>
    );
}
