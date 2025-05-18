import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DaoAuth from "../model/DaoAuth.js";
import {
  NotificationContainer,
  notifyWarning,
  notifyError,
  notifySuccess,
} from "../components/notification.js";
import LoadingModal from "../components/LoadingModal";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const navigate = useNavigate();
  const authDao = new DaoAuth();
  const [loading, setLoading] = useState(false);

  const cadastrar = async () => {
    try {
      setLoading(true);
      if (email === "" || senha === "" || nome === "" || dataNasc === "") {
        notifyWarning("Preencha todos os dado!");
        return;
      }
      const cred = await authDao.cadastrarUsuario(email, senha, nome, dataNasc);
      navigate("/");
      notifySuccess("Cadastro criado com sucesso!");
    } catch (error) {
      notifyError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <h2 className="mb-4 text-center">Cadastro</h2>

              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome"
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Data de Nascimento</label>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => setDataNasc(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Senha"
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  onClick={cadastrar}
                  className="btn btn-primary"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <NotificationContainer />
      <LoadingModal visible={loading} text="Aguarde..." />
    </>
  );
}
