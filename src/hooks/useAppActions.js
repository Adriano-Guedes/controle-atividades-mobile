import { useNavigate } from "react-router-dom";
import { signOut, getAuth } from "firebase/auth";

export default function useAppActions() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const goToMaterias = (id) => {
    navigate(`/home/${id}/materias`);
  };

  const goToHome = (id) => {
    navigate(`/home/${id}`);
  };

  const goToMateria = (userId, matId) => {
    navigate(`/home/${userId}/materia/${matId}`);
  };

  const goToAtividade = (userId, matId, atividadeId) => {
    navigate(`/home/${userId}/materia/${matId}/atividade/${atividadeId}`);
  };

  return {
    handleLogout,
    goToMaterias,
    goToHome,
    goToMateria,
    goToAtividade
  };
}
