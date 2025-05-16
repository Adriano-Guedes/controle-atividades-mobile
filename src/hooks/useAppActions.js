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


  return {
    handleLogout,
    goToMaterias,
    goToHome,
  };
}
