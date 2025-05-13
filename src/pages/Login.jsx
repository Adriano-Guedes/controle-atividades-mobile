import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      navigate(`/home/${cred.user.uid}`);
    } catch (error) {
      alert("Erro no login: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <h2 className="mb-4 text-center">Entrar</h2>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="d-flex justify-content-center">
              <button type="button" onClick={login} className="btn btn-primary">
                Entrar
              </button>
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="btn btn-warning"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
