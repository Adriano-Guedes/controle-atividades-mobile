import { Routes, Route, Navigate } from 'react-router-dom';
import Login    from './pages/Login.jsx';
import Cadastro from './pages/Cadastro.jsx';
import Home     from './pages/Home.jsx';
import Materias  from './pages/Materias.jsx';
import Materia  from './pages/Materia.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/home/:id" element={<Home />} />
            <Route path="/home/:id/materias" element={<Materias />} />
            <Route path="/home/:id/materia/:materiaId" element={<Materia />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
