import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../services/firebase";
import Usuario from "./usuario/Usuario";

export default class DaoAuth {
  async cadastrarUsuario(email, senha, nome, dataNasc) {
    try {
      if (!email || !senha || !nome || !dataNasc) {
        throw new Error("Todos os campos são obrigatórios.");
      }
      const newUsuario = new Usuario(nome, dataNasc, email);
      const userCredential = await createUserWithEmailAndPassword(auth, newUsuario.email, senha);
      const user = userCredential.user;

      await set(ref(database, `usuarios/${user.uid}`), {
        nome: newUsuario.nome,
        dataNasc: newUsuario.dataNasc,
        email: newUsuario.email
      });

      return user.uid;
    } catch (error) {
      throw new Error(error);
    }
  }

  async loginUsuario(email, senha) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      return cred.user.uid;
    } catch (error) {
      console.error("Erro no login:", error);
      throw new Error("Email ou senha inválidos.");
    }
  }
}
