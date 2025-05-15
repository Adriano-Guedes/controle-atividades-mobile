import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../firebaseConfig";
import Usuario from "./usuario/Usuario";

export default class DaoAuth {
  async cadastrarUsuario(email, senha, nome, dataNasc) {
    try {
      const newUsuario = new Usuario(nome, dataNasc, email);
      const userCredential = await createUserWithEmailAndPassword(auth, newUsuario.email, newUsuario.senha);
      const user = userCredential.user;

      await set(ref(database, `usuarios/${user.uid}`), {
        nome: newUsuario.nome,
        dataNasc: newUsuario.dataNasc,
        email: newUsuario.email,
      });

      return user.uid;
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error.message);
      throw new Error("Não foi possível cadastrar o usuário.");
    }
  }

  async loginUsuario(email, senha) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      return cred.user.uid;
    } catch (error) {
      console.error("Erro no login:", error.message);
      throw new Error("Email ou senha inválidos.");
    }
  }
}
